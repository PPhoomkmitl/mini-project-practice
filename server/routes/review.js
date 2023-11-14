const express = require('express')
const {
    createReview,
    getAllReviews,
    createRating,
    getRatingCategoryMonthly
} = require('../controller/reviewController')
const authAccess = require('../middleware/authAccess')

const router = express.Router()

// GET all Review
router.get('/all-reviews', getAllReviews)
// GET Rating by name
router.get('/get-rating/:categoryName' , getRatingCategoryMonthly)
// POST  create Review
router.post('/create-review', authAccess ,createReview)
// POST  create Rating
router.post('/create-rating' , createRating)

module.exports = router