const { connect } = require('../config/database');
const { calculateAverage } = require('../service/calculateAverageRating')

const getAllReviews = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    const [review] = await connection.execute(`
      SELECT review.*, users.user_name
      FROM review
      INNER JOIN users ON review.user_id = users.id
      ORDER BY review.created_at DESC
    `);
  
    res.status(200).json(review);

  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ error: 'An error occurred while fetching reviews.' })
  } finally{
    connection.release();
  }
}

const createReview = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    const { content, category } = req.body
    const userId = req.user.user_id
  
    const [user] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }


    const [createdReview] = await connection.execute(`
      INSERT INTO review (content, category, created_at, user_id)
      VALUES (?, ?, ?, ?)
    `, [content, category, new Date(), user[0].id]);

        // connection.release()
    console.log('Review created with ID:', createdReview.insertId);



    const [review] = await connection.execute('SELECT review.*, users.user_name FROM review INNER JOIN users ON review.user_id = users.id WHERE review.id = ?', 
    [createdReview.insertId]);
      
    console.log(review)

    // Current time
    if (review) {
      const timeStamp = new Date(review.created_at)
      const currentDate = new Date()
      let timeDifference = currentDate - timeStamp
      let timeString = ''
        
      const timeUnits = [
      { label: 'ปี', duration: 1000 * 60 * 60 * 24 * 365 },
      { label: 'เดือน', duration: 1000 * 60 * 60 * 24 * 30 },
      { label: 'วัน', duration: 1000 * 60 * 60 * 24 },
      { label: 'ชั่วโมง', duration: 1000 * 60 * 60 },
      { label: 'นาที', duration: 1000 * 60 },
      { label: 'วินาที', duration: 1000 }
      ];
        
      for (const unit of timeUnits) {
        const unitValue = Math.floor(timeDifference / unit.duration);
        if (unitValue > 0) {
          timeString = `${unitValue} ${unit.label}`
          break
        }
      }
        
      const updatedReview = {
        ...review,
        timeSincePosted: timeString || 'เพิ่งโพสต์'
      };
        
      res.status(201).json(updatedReview);
      } else {
        res.status(404).json({ error: 'Review not found' })
      }

    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'An error occurred while creating the review.' })
    } finally {
      connection.release()
    }
}

const createRating = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    const { group1 ,group2 ,group3 , date, category, user } = req.body;
    console.log(group1 ,group2 ,group3 , user )

    // ตรวจสอบว่า user.id ไม่เป็น undefined หรือ null ก่อนที่จะทำ query
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ทำการ query หา user จาก id ที่รับมาจาก req.body
    const [userIdResult] = await connection.execute('SELECT id FROM users WHERE id = ?', [user]);
    

    console.log(userIdResult)
    console.log(userIdResult[0].id)

    // ตรวจสอบว่า userIdResult ไม่เป็น undefined หรือ null และมีข้อมูล user
    if (!userIdResult || userIdResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ทำการ insert rating โดยใช้ userIdResult[0].id ที่ได้จากการ query
    await connection.execute(
      'INSERT INTO rating (group1 ,group2 ,group3, created_at , category ,user_id) VALUES (?, ?, ?, NOW(), ?, ?)',
      [group1 ,group2 ,group3, category, userIdResult[0].id]
    );

    res.status(200).json("Success created rating");
  } catch (error) {
    console.error('Error fetching create-rating:', error);
    res.status(500).json({ error: 'An error occurred while fetching create-rating.' });
  } finally{
    connection.release();
  }
};



const getRatingCategoryMonthly = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    const categoryName = req.params.categoryName;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    console.log(categoryName  , firstDayOfMonth , lastDayOfMonth)
    // const ratings = await Rating.find({ category: categoryName, date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } });
    const [ratings] = await connection.execute(
      'SELECT * FROM rating WHERE category = ? AND created_at BETWEEN ? AND ?',
      [categoryName, firstDayOfMonth, lastDayOfMonth]
    );

    console.log(ratings)
    if (ratings.length === 0) {
      const defaultRatings = { group1: 5, group2: 5, group3: 5 }; // ถ้าไม่พบข้อมูลในช่วงเวลาที่ระบุ ให้ให้ค่าเรตติ้งทั้งสามกลุ่มเป็น 5
      return res.status(200).json({ averageRating: defaultRatings, totalReviews: 0 });
    }
    console.log("Rating",ratings.group1)
    const group1Ratings = ratings.map(rating => rating.group1 || 5);
    const group2Ratings = ratings.map(rating => rating.group2 || 5);
    const group3Ratings = ratings.map(rating => rating.group3 || 5);

    console.log("Rating",group1Ratings)
    const averageRating = {
      group1: calculateAverage(group1Ratings),
      group2: calculateAverage(group2Ratings),
      group3: calculateAverage(group3Ratings)
    };


    const totalReviews = ratings.length;

    res.status(200).json({ averageRating, totalReviews });
  } catch (error) {
    console.error('Error fetching category monthly rating:', error);
    res.status(500).json({ error: 'An error occurred while fetching category monthly rating.' });
  } finally{
    connection.release();
  }
};


module.exports = {
  createReview,
  getAllReviews,
  createRating,
  getRatingCategoryMonthly
}