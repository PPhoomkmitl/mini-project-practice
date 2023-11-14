const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const authAccess = require('../middleware/authAccess')

const {
  uploadFile,
  getAllByCategoryFileUpload,
  downloadFile
} = require('../controller/uploadFileController')

//GET All Files
router.get('/all-Files', getAllByCategoryFileUpload);
// POST UploadFiles
router.post('/uploadFile', authAccess, upload.single('pdfFile'), (req, res) => uploadFile(req, res, req.file));
//GET downloadFiles
router.get('/downloadFile/:filename', downloadFile);

module.exports = router
