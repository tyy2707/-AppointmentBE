const express = require('express')

const feedbackController = require('../controllers/feedbackController')


const router = express.Router()
// Tạo feedback
router.post('/', feedbackController.createFeedback)
// Danh sách toàn bộ lượt feedback 
router.get('/', feedbackController.getListFeedback)
module.exports = router;
