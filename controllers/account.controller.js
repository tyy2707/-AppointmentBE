const accountModel = require('../models/accountModel');
const Account = require('../models/accountModel');

const AvatarDefaultMale = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd8cA2ZFhDQNoAbQ5l5qx6HFzrUHziPweY3BR5vm_cJQ&s'
const AvatarDefaulFetMale = 'https://i.pinimg.com/originals/d3/f9/13/d3f913b8dd27fac04b26c2c9a903610d.png'

const accountController = {

  signupAccount: async (req, res) => {
    try {
      const { password, phone, role } = req.body;
      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
      const existingUser = await Account.findOne({ phone });
      if (existingUser) {
        // Nếu email đã tồn tại, trả về lỗi và ngăn không cho tạo tài khoản mới
        return res.status(202).json({ error: 'Phone already exists' });
      }
      // Tạo mới tài khoản với thông tin được cung cấp
      var fullName = phone
      const newUser = new Account({ fullName, password, phone, role });
      // Lưu tài khoản mới vào cơ sở dữ liệu
      const savedUser = await newUser.save();
      // Trả về thông tin tài khoản vừa được tạo
      res.status(201).json(savedUser);
    } catch (err) {
      // Xử lý lỗi nếu có
      res.status(400).json({ message: err.message });
    }
  },
  signupAccountDoctor: async (req, res) => {
    try {
      const {
        fullName,
        specialize,
        experience,
        // address,
        // province,
        // district,
        // ward,
        branchId,
        dateOfBirth,
        gender,
        academicRank,
        phone,
        email,
        // position,
        // academicRank,
        degree,
        introduction,
        // departmentId,
        // username,
        avatar,
        password = 123456,
        role = 2
      } = req.body;
      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
      const existingUser = await Account.findOne({ phone });
      if (existingUser) {
        // Nếu email đã tồn tại, trả về lỗi và ngăn không cho tạo tài khoản mới
        return res.status(202).json({ error: 'Phone already exists' });
      }
      // Tạo mới tài khoản với thông tin được cung cấp
      if (avatar) {
        avatarUrl = avatar
      } else {
        if (gender === 'male') {
          avatarUrl = AvatarDefaultMale
        } else {
          avatarUrl = AvatarDefaulFetMale
        }
      }
      const newUser = new Account({
        fullName,
        specialize,
        experience,
        // address,
        // province,
        // district,
        phone,
        gender,
        dateOfBirth,
        email,
        branchId,
        academicRank,
        degree,
        // province,
        // district,
        // ward,
        // address,
        // branchId,
        // departmentId,
        // position,
        introduction,
        avatar: avatarUrl,
        password,
        role
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
  getAccountDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Account.findById(id);
      if (user) {
        res.status(200).json(user);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  changePassword: async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
      // Find the account by ID
      const account = await Account.findById(id);
      if (!account) {
        return res.status(404).json({ message: "Không tim thấy tài khoản" });
      }

      // Compare old password
      const isPasswordValid = oldPassword === account.password ? true : false;
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Sai mật khẩu cũ" });
      }
      // Update the password in the database
      await Account.findByIdAndUpdate(id, { password: newPassword });
      res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getListAccount: async (req, res) => {
    try {
      const { keyword, role, branchId } = req.query;
      let query = {};
      if (keyword) {
        query = {
          $or: [
            { fullName: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
            { phoneNumber: { $regex: keyword, $options: 'i' } }
          ]
        };
      }
      // Sử dụng $and để kết hợp điều kiện tìm kiếm keyword và role (nếu có)
      if (role) {
        query.role = role;
      }
      if (branchId) {
        query.branchId = branchId;
      }
      const users = await Account.find(query);
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  loginAccount: async (req, res) => {
    try {
      const { phone, password } = req.body;
      const existingUser = await Account.findOne({ phone, password });
      if (existingUser) {
        // Nếu email đã tồn tại, trả về data
        return res.status(201).json(existingUser);
      }
      return res.status(202).json({ error: 'Phone or password wrong' });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateAccountInfo: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, avatar, fullName, address, province, district, ward, dateOfBirth, gender, phoneNumber, position, academicRank, degree, introduction, departmentId, branchId, status } = req.body;

      // Tìm kiếm tài khoản theo email và mật khẩu
      const existingUser = await Account.findById(id);
      if (existingUser) {
        // Cập nhật thông tin nếu tài khoản đã tồn tại
        if (fullName) {
          existingUser.fullName = fullName;
        }
        if (email) {
          existingUser.email = email;
        }
        if (address) {
          existingUser.address = address;
        }
        if (province) {
          existingUser.province = province;
        }
        if (district) {
          existingUser.district = district;
        }
        if (ward) {
          existingUser.ward = ward;
        }
        if (dateOfBirth) {
          existingUser.dateOfBirth = dateOfBirth;
        }
        if (gender) {
          existingUser.gender = gender;
        }
        if (phoneNumber) {
          existingUser.phoneNumber = phoneNumber;
        }
        if (position) {
          existingUser.position = position;
        }
        if (academicRank) {
          existingUser.academicRank = academicRank;
        }
        if (degree) {
          existingUser.degree = degree;
        }
        if (introduction) {
          existingUser.introduction = introduction;
        }
        if (branchId) {
          existingUser.branchId = branchId;
        }
        if (departmentId) {
          existingUser.departmentId = departmentId;
        }
        if (avatar) {
          existingUser.avatar = avatar;
        }
        if (status) {
          existingUser.status = status;
        }
        // Lưu thay đổi
        await existingUser.save();

        // Trả về thông tin tài khoản đã cập nhật
        return res.status(200).json(existingUser);
      }

      // Trả về lỗi nếu tài khoản không tồn tại
      return res.status(404).json({ error: 'Account not found' });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = accountController;
