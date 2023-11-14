const express = require('express')
const {
    createQuestion,
    getAllQuestions,
    updateLikeQuestionById,
    updateDislikeQuestionById,
    createComment
} = require('../controller/questionController')
const authAccess = require('../middleware/authAccess')

const router = express.Router()

// GET all Question
router.get('/all-questions', getAllQuestions)

// POST  create Question
router.post('/create-question', authAccess ,createQuestion )

// PUT likeQuestion
router.put('/like/:id', authAccess , updateLikeQuestionById )

// PUT DislikeQuestion
router.put('/dislike/:id', authAccess , updateDislikeQuestionById)

//POST Comment
router.post('/createComment/:id', authAccess , createComment )

module.exports = router