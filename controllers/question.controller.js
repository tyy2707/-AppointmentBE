const { error } = require('jquery');
const Question = require('../models/questionModel');
const branchModel = require('../models/branchModel');

const QuestionController = {

  signupQuestion: async (req, res) => {
    try {
      const {
        user_id,
        fullName,
        age,
        content,
        gender,
        phone,
        title,
        email,
      } = req.body;
      const newData = new Question({
        user_id,
        fullName,
        age,
        content,
        title,
        gender,
        phone,
        email,
      });
      const savedData = await newData.save();
      res.status(201).json(savedData);
    } catch (err) {
      // Xử lý lỗi nếu có
      res.status(400).json({ message: err.message });
    }
  },
  getListQuestion: async (req, res) => {
    try {
      const { user_id, doctor_id, department_id, status } = req.query;
      let query = {};
      if (user_id) {
        query.user_id = user_id;
      }
      if (department_id) {
        query.department_id = department_id;
      }
      if (doctor_id) {
        query.doctor_id = doctor_id;
      }
      if (status) {
        query.status = status;
      }
      let listData = await Question.find(query)
        .populate({
          path: 'doctor_id', // Tên trường chứa ID của bác sĩ trong bảng Question
          model: 'Account', // Tên mô hình đại diện cho bảng Account
          select: ['fullName', 'avatar', 'academicRank', 'branchId']
        })
        .sort({ created_at: -1 })
        .exec();
      // for (let i = 0; i < listData.length; i++) {
      //   const question = listData[i];
      //   // Lấy thông tin chi nhánh từ Branch collection
      //   if (question?.doctor_id) {
      //     // Thêm promise vào mảng branchPromises
      //     const branchInfo = await branchModel.findById(question.doctor_id.branchId).lean();
      //     if (branchInfo) {
      //     }
      //     listData[i].branchName = 2222;
      //   }
      // }
      res.json(listData);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const existingObject = await Question.findById(id);
      if (!existingObject) {
        return res.status(404).json({ error: 'Question not found' });
      }
      await Question.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const {
        doctor_id,
        id,
        department_id,
        reply,
        status,
      } = req.body;
      const existingObject = await Question.findById(id);
      if (existingObject) {
        if (doctor_id) {
          existingObject.doctor_id = doctor_id
        }
        if (department_id) {
          existingObject.department_id = department_id
        }
        if (status) {
          existingObject.status = status
        }
        if (reply) {
          existingObject.reply = reply
        }
        await existingObject.save();
        // Trả về thông tin tài khoản đã cập nhật
        return res.status(200).json(existingObject);
      }
      // Trả về lỗi nếu tài khoản không tồn tại
      return res.status(404).json({ error: 'Question not found' });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = QuestionController;
