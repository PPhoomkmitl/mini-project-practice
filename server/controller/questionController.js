// const Question = require('../model/Question')
// const User = require('../model/User')
// const mongoose = require('mongoose')

const { connect } = require('../config/database');
const createQuestion = async (req, res) => {
    const pool = await connect();
    const connection = await pool.getConnection();
    try {
        const { contentResult, categoryResult } = req.body;
        console.log(contentResult, categoryResult)
        const userId = req.user.user_id;
        // console.log("Time Check",new Date())
        // const user = await User.findById(userId);
        const [user] = await connection.execute('SELECT id FROM users WHERE id = ?', [userId]);
        // connection.release();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(contentResult, categoryResult, user[0].id)

        // Inserting a new question
        const [createdQuestion] = await connection.execute(
          'INSERT INTO question (content, created_at, category, user_id) VALUES (?,CONVERT_TZ(NOW(), \'+00:00\', \'+07:00\') , ?, ?)',
          [contentResult, categoryResult, user[0].id]
        );

        const insertedQuestionId = createdQuestion.insertId;

        console.log("QID1",insertedQuestionId)
        const [questionResult] = await connection.execute(
          'SELECT q.content, q.created_at, q.category, u.id as user_id, u.user_name FROM question q JOIN users u ON q.user_id = u.id WHERE q.id = ?',
          [insertedQuestionId]
        );
        console.log("questionResult",questionResult[0])
        const { content, created_at, category, user_id, user_name } = questionResult[0];

        const question = {
          id: insertedQuestionId, // ตั้งค่า id ตามที่คุณต้องการ
          content,
          created_at,
          category,
          user_id,
          user_name,    
        };

        console.log("question",question)
        // connection.release();

        if (question) {
          const timeStamp = question.created_at;
          const currentDate = new Date();
          let timeDifference = currentDate - timeStamp;
          let timeString = '';
        
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
              timeString = `${unitValue} ${unit.label}`;
              break;
            }
          }
        
          const updatedQuestion = {
            ...question,
            timeSincePosted: timeString || 'เพิ่งโพสต์'
          };

          console.log(updatedQuestion )
          // connection.release();
          res.status(201).json(updatedQuestion);
        } else {
          res.status(404).json({ error: 'Question not found' });
        }

    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'An error occurred while creating the question.' });
    } finally {
      connection.release();
    }
}

const getAllQuestions = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    const [questions] = await connection.execute(`
    SELECT 
    q.id AS question_id,
    q.content AS question_content,
    q.created_at AS question_created_at,
    q.category AS question_category,
    q.user_id AS question_user_id,
    u.user_name AS question_user_name,
    c.id AS comment_id,
    c.content AS comment_content,
    c.created_at AS comment_created_at,
    c.user_id AS comment_user_id,
    cu.user_name AS comment_user_name,
    c.question_id AS comment_question_id
    FROM 
      question q
    JOIN 
      users u ON q.user_id = u.id
    LEFT JOIN 
      comment c ON q.id = c.question_id
    LEFT JOIN
      users cu ON c.user_id = cu.id
    ORDER BY 
    q.created_at DESC, c.created_at ASC;
    `);
  const questionMap = new Map();

  questions.forEach((row) => {
    const questionId = row.question_id;

    if (!questionMap.has(questionId)) {
      questionMap.set(questionId, {
        id: questionId,
        content: row.question_content,
        created_at: row.question_created_at,
        category: row.question_category,
        user_name: row.question_user_name,
        comments: [],
      });
    }

    const question = questionMap.get(questionId);

    if (row.comment_id) {
        question.comments.push({
          id: row.comment_id,
          content: row.comment_content,
          created_at: row.comment_created_at,
          user_name: row.comment_user_name,
          questionID: row.comment_question_id,
        });
      }
    });

    const formattedQuestions = Array.from(questionMap.values());
    // connection.release();
    res.status(200).json(formattedQuestions);

  } catch (error) {
    console.error('Error fetching questions:', error)
    res.status(500).json({ error: 'An error occurred while fetching questions.' })
  } finally {
    connection.release();
  }
}

const updateLikeQuestionById  = async (req, res) => {
    try {
      const questionId = req.params.questionId
      const userId = req.user._id
      const existingLike = await ReportLike.findOne({ question: questionId, user: userId })

      if (existingLike) 
      {
        await ReportLike.findByIdAndUpdate(questionId, {$set: { likes: false }})
      } 
      else 
      {
        await ReportLike.findByIdAndUpdate(questionId, {$set: { likes: true }})
      }
      //total like and dislike
      // const {likes , dislikes} = calculateLikesAndDislikes(questionId)
      res.json('Success like')
    } catch (error) {
      console.error('Error liking question:', error);
      res.status(500).json({ error: 'An error occurred while liking the question.' });
    }
}
  
  
const updateDislikeQuestionById = async (req, res) => {
    try {
      const questionId = req.params.questionId;
      // อัปเดตค่า dislikes ของคำถาม
      await Question.findByIdAndUpdate(questionId, { $inc: { dislikes: 1 } });
      res.status(200).json({ message: 'Disliked successfully.' });
    } catch (error) {
      console.error('Error disliking question:', error);
      res.status(500).json({ error: 'An error occurred while disliking the question.' });
    }
}

//Comment
const createComment = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  // const formattedTimeStamp = indochinaTime.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  try {
    const { content , userId , user_name ,questionID  } = req.body
    //update
    // const questionComment = await Question.findByIdAndUpdate(req.params.id , {
    //   $push : { comments: {content : content , userId : userId , userNameComment : userNameComment ,questionID : questionID , timeStamp : timeStamp}}
    // },
    //   { new: true }
    // )
    console.log("QID",questionID)
    const [commentResults] = await connection.execute(
      'INSERT INTO comment (content, created_at, user_id, user_name, question_id) VALUES (?, CONVERT_TZ(NOW(), \'+00:00\', \'+07:00\'), ?, ?, ?)',
      [content, userId, user_name , questionID]
    );
 
    
    // หลังจากเพิ่ม comment เรียบร้อยแล้ว, ต้องดึง comment ที่เพิ่มมาเพื่อให้คนใช้งานรู้
    const [newCommentResults] = await connection.execute(
      'SELECT * FROM comment WHERE id = ?',
      [commentResults.insertId]
    );

    const newComment = newCommentResults[0];
    // const updatedQuestion = await connectionPool.execute(
    //   'SELECT * FROM questions WHERE id = ?',
    //   [questionID]
    // );
    // connection.release();
    console.log("UPDATE Question");
    res.status(200).json(newComment)
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'An error occurred while creating the comment.' });
  } finally {
    connection.release();
  }
}

module.exports = {
  createQuestion,
  getAllQuestions,
  updateLikeQuestionById,
  updateDislikeQuestionById, 
  createComment
}