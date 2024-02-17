const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = process.env;
const { connect } = require('../config/database');
const uuid = require('uuid');

/* Libery OTP */
const speakeasy = require('speakeasy');

const deleteExpiredSecret = async (secretId) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM secret WHERE id = ?', [secretId]);
    console.log(`Deleted secret with ID ${secretId}`);
  }
  catch(err){
    console.error("Connect went wrong " , err)
  }
  finally{
    connection.release()
  }
};

const generateSecret = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    console.log("Secret:", secret);
    
    // สร้าง UUID โดยใช้ไลบรารี uuid
    const uuidValue = uuid.v4();

    await connection.execute('INSERT INTO secret (id , value) VALUES (?, ?)', [uuidValue, secret.base32]);
    const expirationTime = 30 * 1000; // 30วิ

    // เก็บเวลาที่ secret ถูกสร้าง
    const creationTime = Date.now();

    // ตั้งเวลาให้ secret หมดอายุใน 30 วินาที
    setTimeout(async () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - creationTime;
      if (elapsedTime >= expirationTime) {
        try {
          await deleteExpiredSecret(uuidValue);
        } catch (error) {
          console.error('Error deleting expired secret:', error);
        }
      }
    }, expirationTime);
    console.log('Success Secret 1', secret.base32);
    return uuidValue;
  } catch{
    console.error("Connect went wrong " , err)
  } finally{
    connection.release()
  }
};


const generateOTP = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try{
    const { email } = req.body;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@kmitl\.ac\.th$/;

    if(!emailPattern.test(email)){
      return res.status(404).json({ error: 'User Does not from KMITL.' });
    }
    const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);   

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists. Please login.' });
    }

    const id = await generateSecret()
    console.log('Sending id:',id)
    const [secret] = await connection.execute('SELECT value FROM secret WHERE id = ?', [id]);

    if (!secret) {
      return res.status(404).json({ error: 'Secret not found' });
    }

    // อัปเดต email ในฐานข้อมูล
    await connection.execute('UPDATE secret SET email = ? WHERE id = ?', [email,id]);
    const [getSecret] = await connection.execute('SELECT * FROM secret WHERE id = ?', [id]);
    
    console.log('Sending id :', getSecret[0].id)
    console.log('Sending value :', getSecret[0].value)
    console.log('Type of id:', typeof id);

    const otp = speakeasy.totp({
      secret: getSecret[0].value,
      encoding:'base32',
      digits: 6
    });

    sendOtpEmail(email, otp);
    console.log('Sending token:', otp);
    console.log('<---Success genOTP--->')
    res.status(200).json({ message: 'OTP sent successfully' , id });
  } catch(err) {
    console.log("Connect went wrong " , err)
  } finally{
    connection.release()
  }
};

const verifyOTP = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();
  try {
    const { id , token } = req.body;
    console.log('Received id:', id);
    console.log('Type of id:', typeof id);
    console.log('Type of token:', typeof token);
    console.log('Received token:', token);
    if (!id || !token) {
      return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
    }
    const [secret] = await connection.execute('SELECT * FROM secret WHERE id = ?', [id]);

    console.log('Secret value:', secret)

    if (!secret) {
      return res.status(404).json({ error: 'Secret not found' });
    }
    const email = secret[0].email
    console.log('Secret value:', typeof secret[0].value);
    console.log('Secret value:', secret[0].value);
    const isValid = speakeasy.totp.verify({
      secret: secret[0].value,
      encoding: 'base32',
      token ,
      digits: 6
    });
    console.log(isValid)
    res.json({ isValid , email });
  } catch{
    console.log("Connect went wrong " , err)
  } finally {
    connection.release();
  }
};

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kmitlinsight@gmail.com',
        pass: 'blct wrjs nbna hhpq'
      }
    });

    const mailOptions = {
      from: 'kmitlinsight@gmail.com',
      to: email,
      subject: 'รหัส OTP สำหรับการลงทะเบียน',
      html: `<h1>เทสระบบการส่งotp ภูมิ</h1><p>รหัส OTP ของคุณคือ: ${otp}</p>`
      
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('An error occurred while sending OTP email.');
  }
};

const getCheckLogin = async (req, res) => {
    const pool = await connect();
    const connection = await pool.getConnection();
    try {
      const { email , isLogin } = req.user
      const [user] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);  
      res.status(200).json({ user ,  isLogin });

    } catch (error) {
      console.error('Error checking login:', error);
      res.status(500).json({ error: 'An error occurred while checking login status.' });
    } finally{
      connection.release();  
    }
}
  

/* Register */
const createRegister = async (req, res) => {
    const pool = await connect();
    const connection = await pool.getConnection();
    try {
      const { user_name , first_name, last_name, email, password } = req.body;
  
      if (!(user_name && email && password && first_name && last_name)) {
        return res.status(400).send('All input is required');
      }
      const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

      if (existingUser && existingUser.length > 0) {
          return res.status(409).json({ error: 'User already exists. Please login.' });
      } else {
          const encryptedPassword = await bcrypt.hash(password, 10);
          const [result] = await pool.query('INSERT INTO users (user_name, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)',
              [user_name, first_name, last_name, email.toLowerCase(), encryptedPassword]);

          const newUser = {
              id: result.insertId,
              user_name,
              first_name,
              last_name,
              email: email.toLowerCase(),
              password: encryptedPassword,
          };
        res.status(201).json({ user: newUser})
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'An error occurred while creating the user.' });
    } finally{
      connection.release()
    }

}


  const createLogin = async (req, res) => {
    const pool = await connect();
    const connection = await pool.getConnection();
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        return res.status(400).json({ error: 'All input is required' });
      }

        const [user] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        console.log('get',user[0].user_name)

        if (user && await bcrypt.compare(password, user[0].password)) {
            const accessToken = jwt.sign(
                { user_id: user[0].id, email, isLogin: true },
                config.ACCESS_TOKEN_SECRET,
                { expiresIn: '2h' }
            );

            const refreshToken = jwt.sign(
                { user_id: user[0].id, email },
                config.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            res.status(200).json({ user, accessToken, refreshToken });
        } else {
            res.status(401).json({ error: 'Invalid Credentials' });
        }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'An error occurred while logging in.' });
    } finally{
      connection.release();
    }
  }
  
  const createRefresh = async (req, res) => {
    try {
      const user = req.user
      const accessToken = jwt.sign(
      { user_id: user.id, email:user.email , isLogin: true },
        config.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
      );
      
      res.status(200).json({ accessToken });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'An error occurred while refreshing the token.' });
    } 
  }
module.exports = {
    getCheckLogin,
    createRegister,
    createLogin,
    createRefresh,
    generateSecret,
    generateOTP,
    verifyOTP
}


