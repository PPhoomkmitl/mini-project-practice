const express = require('express')
const {
    getCheckLogin,
    createRegister,
    createLogin,
    createRefresh,
    generateOTP,
    verifyOTP
} = require('../controller/authenController')
const authAccess = require('../middleware/authAccess')
const authRefresh = require('../middleware/authRefresh')
const router = express.Router()

// GET isLogIn (/check-login)
router.get('/check-login', authAccess , getCheckLogin)

// POST a new Register
router.post('/register', createRegister)

// POST a new LogIn
router.post('/login', createLogin)

// POST RefreshKey
router.post('/refresh', authRefresh ,createRefresh)

// get Generate OTP For Email
router.post('/generateOTP', generateOTP);

// POST Verify OTP For Email
router.post('/verifyOTP', verifyOTP);


module.exports = router