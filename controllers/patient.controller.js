const bookingModel = require('../models/bookingModel');
const Patient = require('../models/patientModel');
const scheduleModel = require('../models/scheduleModel');

const patientController = {

  getListPatient: async (req, res) => {
    try {
      const { userId, keyword, _id } = req.query;
      let query = {};
      if (_id) {
        const existingData = await Patient.findById(_id);
        return res.status(200).json(existingData);
      }
      if (typeof keyword !== 'undefined') {
        query = {
          $or: [
            { fullName: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
            { phoneNumber: { $regex: keyword, $options: 'i' } }
          ]
        };
      }
      if (userId) {
        query.userId = userId;
      }

      const users = await Patient.find(query);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getPatientDetail: async (req, res) => {
    try {
      const { id } = req.params;
      let users = await Patient.findById(id)
      let query = {
        patientId: id
      };

      let listData = await bookingModel.find(query)
      let newList = []
      for (let i = 0; i < listData.length; i++) {
        const shiftInfo = listData[i].shiftId; // Lấy thông tin về shift từ listData
        console.log("🚀 ~ getPatientDetail: ~ listData[i]:", listData[i])
        if (shiftInfo) {
          const scheduleInfo = await scheduleModel.findById(shiftInfo); // Tìm thông tin chi tiết về shift trong bảng Schedule
          const newObject = {
            ...listData[i]._doc,
            branchName: scheduleInfo.branchName,
            date: scheduleInfo.date,
            timeStart: scheduleInfo.timeStart,
            timeEnd: scheduleInfo.timeEnd,
          }
          newList.push(newObject)
        }
      }
      const data = {
        users: users,
        List: newList
      }
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  signupPatient: async (req, res) => {
    try {
      const {
        userId,
        fullName,
        dateOfBirth,
        phone,
        gender,
        job,
        CCCD,
        email,
        age,
        nation,
        province,
        district,
        ward,
        avatar,
        address,
      } = req.body;
      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
      const existingUser = await Patient.findOne({ phone });
      const existingCCCD = await Patient.findOne({ CCCD });
      if (existingUser) {
        // Nếu email đã tồn tại, trả về lỗi và ngăn không cho tạo tài khoản mới
        return res.status(202).json({ error: 'Phone already exists' });
      }
      if (existingCCCD) {
        // Nếu email đã tồn tại, trả về lỗi và ngăn không cho tạo tài khoản mới
        return res.status(202).json({ error: 'CCCD already exists' });
      }
      // Tạo mới tài khoản với thông tin được cung cấp
      const newUser = new Patient({
        userId,
        fullName,
        dateOfBirth,
        phone,
        gender,
        job,
        CCCD,
        email,
        age,
        nation,
        province,
        district,
        avatar,
        ward,
        address,
      });
      // Lưu tài khoản mới vào cơ sở dữ liệu
      const savedUser = await newUser.save();
      // Trả về thông tin tài khoản vừa được tạo
      res.status(201).json(savedUser);
    } catch (err) {
      // Xử lý lỗi nếu có
      res.status(400).json({ message: err.message });
    }
  },

  loginPatient: async (req, res) => {
    try {
      const { phone, password } = req.body;
      const existingUser = await Patient.findOne({ phone, password });
      if (existingUser) {
        // Nếu email đã tồn tại, trả về data
        return res.status(201).json(existingUser);
      }
      return res.status(202).json({ error: 'Phone or password wrong' });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updatePatientInfo: async (req, res) => {
    try {
      const {
        _id,
        fullName,
        phone,
        gender,
        dateOfBirth,
        job,
        CCCD,
        email,
        age,
        nation,
        province,
        district,
        ward,
        address,
        avatar
      } = req.body;

      // Tìm kiếm tài khoản theo email và mật khẩu
      const existingUser = await Patient.findById(_id);
      if (existingUser) {
        // Cập nhật thông tin nếu tài khoản đã tồn tại
        existingUser.fullName = fullName;
        existingUser.address = address;
        existingUser.province = province;
        existingUser.district = district;
        existingUser.ward = ward;
        existingUser.dateOfBirth = dateOfBirth;
        existingUser.gender = gender;
        existingUser.nation = nation;
        existingUser.age = age;
        existingUser.email = email;
        existingUser.CCCD = CCCD;
        existingUser.job = job;
        existingUser.phone = phone;
        existingUser.avatar = avatar;
        // Lưu thay đổi
        await existingUser.save();

        // Trả về thông tin tài khoản đã cập nhật
        return res.status(200).json(existingUser);
      }

      // Trả về lỗi nếu tài khoản không tồn tại
      return res.status(404).json({ error: 'Patient not found' });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

};

module.exports = patientController;
