const express = require('express')
const {
    getAllCategory,
    getColorCategoryByName
} = require('../controller/categoryController')
const router = express.Router()

// GET 
router.get('/allCategory' , getAllCategory)
// GET 
router.get('/ColorCategoryByName/:name', getColorCategoryByName)

module.exports = router