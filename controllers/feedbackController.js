const bookingModel = require('../models/bookingModel');
const Feedback = require('../models/feedbackModel')

const FeedbackController = {
    getListFeedback: async (req, res) => {
        try {
            const { doctor_id } = req.query;
            let query = {};
            if (doctor_id) {
                query.doctor_id = doctor_id;
            }
            const listData = await Feedback.find(query);
            res.json(listData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    createFeedback: async (req, res) => {
        try {
            const {
                booking_id,
                comment,
                departmentName,
                doctor_id,
                patient_avatar,
                patient_id,
                patient_name,
                shift_id,
                star,
                user_id
            } = req.body;
            const existingData = await bookingModel.findOne({ _id: booking_id });
            if (!existingData) {
                // Nếu email đã tồn tại, trả về lỗi và ngăn không cho tạo tài khoản mới
                return res.status(202).json({ error: 'Không tìm thấy lượt booking' });
            }
            const newObject = new Feedback({
                booking_id,
                comment,
                departmentName,
                doctor_id,
                patient_avatar,
                patient_id,
                patient_name,
                shift_id,
                star,
                user_id
            });
            const savedData = await newObject.save();
            existingData.feedback_id = savedData._id
            await existingData.save()
            res.status(201).json(savedData);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    updateFeedback: async (req, res) => {
        try {
            const { id, name, description } = req.body;
            const existingObject = await Feedback.findById(id);
            if (existingObject) {
                existingObject.name = name;
                existingObject.description = description;
                // Lưu thay đổi
                await existingObject.save();
                // Trả về thông tin đã cập nhật
                return res.status(200).json(existingObject);
            }

            // Trả về lỗi nếu không tồn tại
            return res.status(404).json({ error: 'Feedback not found' });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteFeedback: async (req, res) => {
        try {
            const { id } = req.body;
            // Kiểm tra xem Feedback tồn tại không
            const existingFeedback = await Feedback.findById(id);
            if (!existingFeedback) {
                // Nếu Feedback không tồn tại, trả về lỗi
                return res.status(404).json({ error: 'Feedback not found' });
            }

            // Nếu Feedback tồn tại, tiến hành xóa
            await Feedback.findByIdAndDelete(id);
            // Trả về thông báo thành công
            return res.status(200).json({ message: 'Feedback deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
}
module.exports = FeedbackController;