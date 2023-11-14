const { connect } = require('../config/database');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: 'ap-southeast-1', 
});

const uploadFile = async (req, res) => {
  const pool = await connect();
  let connection;
  try {
    const { category, user } = req.body;
    const file = req.file;

    if (!file || !file.originalname || !category || !user) {
      return res.status(400).json({ error: 'Invalid file or missing information' });
    }

    const allowedExtensions = ['.pdf'];
    let fileExtension = file.originalname.slice(((file.originalname.lastIndexOf(".") - 1) >>> 0) + 2);

    // เพิ่มจุดถ้าไม่มี
    fileExtension = fileExtension ? '.' + fileExtension : '';

    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    connection = await pool.getConnection();
    const [userResult] = await connection.execute('SELECT * FROM users WHERE id = ?', [user]);

    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const filePath = path.join('C:\\Users\\Phoom1645\\OneDrive\\เอกสาร\\MyProject\\server\\uploads', file.filename);
    console.log("fliePath :",filePath )
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Upload the file to AWS S3
    const s3UploadParams = {
      Bucket: 'aws-uploads-mydb',
      Key: `uploads/${file.filename}`, // Set the desired path in your S3 bucket
      Body: fs.createReadStream(filePath),
    };
    const s3UploadResult = await s3.upload(s3UploadParams).promise();
    if (!s3UploadResult) {
      return res.status(500).json({ error: 'Error uploading file to AWS S3' });
    }

    // Delete the file from the local server after uploading to S3
    fs.unlinkSync(filePath);

    const [createFile] = await connection.execute(
      'INSERT INTO file (file_name, category, created_at, user_id) VALUES (?, ?, CONVERT_TZ(NOW(), \'+00:00\', \'+07:00\'), ?);',
      [file.filename, category, user]
    );

    const [files] = await connection.execute(`
      SELECT
        f.id AS file_id,
        f.file_name,
        f.category,
        f.created_at AS timeStamp,
        u.user_name,
        u.id AS user_id
      FROM
        file f
      JOIN
        users u ON f.user_id = u.id
      WHERE
        f.id = ?;`, [createFile.insertId]);

    
    // const downloadLink = `${process.env.BASE_URL}/${fileWithUser.file_id}`; // Adjust the URL structure as needed
    connection.release();
    res.status(200).json(files[0]);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  } finally {
    if (connection) connection.release();
  }
};

const getAllByCategoryFileUpload = async (req, res) => {
  const pool = await connect();
  const connection = await pool.getConnection();

  try {
    const [files] = await connection.execute(`
      SELECT
        f.id AS file_id,
        f.file_name,
        f.category,
        f.created_at AS timeStamp,
        u.user_name,
        u.id AS user_id
      FROM
        file f
      JOIN
        users u ON f.user_id = u.id
      ORDER BY
        f.created_at DESC;
    `);

    res.status(200).json(files);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: 'Error fetching file data' });
  } finally {
    if (connection) connection.release();
  }
};


const downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const decodedFilename = decodeURIComponent(filename);

    // Set up the parameters for downloading from S3
    const s3DownloadParams = {
      Bucket: 'aws-uploads-mydb', // Your S3 bucket name
      Key: `uploads/${decodedFilename}`, // The path to the file in S3
    };

    // Download the file from S3
    const s3ReadStream = s3.getObject(s3DownloadParams).createReadStream();

    // Set the appropriate headers for the response
    res.setHeader('Content-Disposition', `attachment; filename=${decodedFilename}`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe the S3 read stream to the response stream
    s3ReadStream.pipe(res);

    // Log success message
    console.log('File downloaded successfully');
  } catch (error) {
    console.error('Error downloading file from S3:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
};


// const downloadFile = async (req, res) => {
//   console.log("Hello Check")
//   const { filename } = req.params;
//   console.log("fileName",filename)
//   const decodedFilename = decodeURIComponent(filename);
//   console.log(decodedFilename)
//   const filePath = path.join('C:\\Users\\Phoom1645\\OneDrive\\เอกสาร\\MyProject\\server\\uploads', decodedFilename);
//   console.log("filePath",filePath)
//   res.download(filePath, (err) => {
//     if (err) {
//       console.error('Error downloading file:', err);
//       res.status(500).json({ message: 'Error downloading file' });
//     } else {
//       console.log('File downloaded successfully');
//     }
//   });
// };

module.exports = {
  uploadFile,
  getAllByCategoryFileUpload,
  downloadFile
};



