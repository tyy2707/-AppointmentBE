const express = require('express')

const bookingController = require('../controllers/bookingController')

const router = express.Router()
// Tạo booking
router.post('/', bookingController.createBooking)

// Danh sách toàn bộ lượt booking 
router.get('/', bookingController.getListBooking)
router.get('/overview', bookingController.getOverView)
// Chi tiết booking (generic parameterized route)

router.get('/chart', bookingController.getChart)
router.get('/top', bookingController.getTopBookingDoctor)


router.get('/:id', bookingController.getDetailBooking)
// cập nhật booking
router.put('/:id', bookingController.updateBooking)

module.exports = router;
