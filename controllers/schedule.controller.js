const { error } = require('jquery');
const Schedule = require('../models/scheduleModel');



const scheduleController = {

  signupSchedule: async (req, res) => {
    try {
      const {
        branchId,
        doctorId,
        departmentId,
        price,
        branchName,
        departmentName,
        date,
        time,
        service,
        note,
      } = req.body;
      const newData = new Schedule({
        branchId,
        doctorId,
        branchName,
        departmentName,
        departmentId,
        price,
        date,
        timeStart: time[0],
        timeEnd: time[1],
        service,
        note,
      });

      const overlappingSchedule = await Schedule.findOne({
        doctorId: doctorId,
        $or: [
          {
            $and: [
              { date: date },
              {
                $or: [
                  { timeStart: { $lte: time[0] }, timeEnd: { $gt: time[0] } }, // Thời gian bắt đầu mới chồng lấn
                  { timeStart: { $lt: time[1] }, timeEnd: { $gte: time[1] } }, // Thời gian kết thúc mới chồng lấn
                  { $and: [{ timeStart: { $gte: time[0] } }, { timeEnd: { $lte: time[1] } }] } // Lịch hẹn mới hoàn toàn bao gồm trong lịch khác
                ]
              }
            ]
          },
          {
            $and: [
              { date: { $ne: date } },
              {
                $or: [
                  { $and: [{ timeStart: { $lt: time[0] } }, { timeEnd: { $gt: time[0] } }] }, // Lịch hẹn mới bắt đầu trong khoảng thời gian của lịch khác
                  { $and: [{ timeStart: { $lt: time[1] } }, { timeEnd: { $gt: time[1] } }] }, // Lịch hẹn mới kết thúc trong khoảng thời gian của lịch khác
                  { $and: [{ timeStart: { $gte: time[0] } }, { timeEnd: { $lte: time[1] } }] } // Lịch hẹn mới hoàn toàn bao gồm trong lịch khác
                ]
              }
            ]
          }
        ]
      });

      if (overlappingSchedule) {
        return res.status(210).json({
          message: "Thời gian lịch khám bị trùng lấn.",
          schedule: {
            overlappingTimeStart: overlappingSchedule.timeStart,
            overlappingTimeEnd: overlappingSchedule.timeEnd,
          }
        });
      }
      const savedData = await newData.save();
      res.status(201).json(savedData);
    } catch (err) {
      // Xử lý lỗi nếu có
      res.status(400).json({ message: err.message });
    }
  },
  getListSchedule: async (req, res) => {
    try {
      const { dateStart, status, doctorId, service, departmentId, branchId } = req.query;
      let query = {};
      if (dateStart) {
        query.date = { $gte: dateStart }
      }
      if (doctorId) {
        query.doctorId = doctorId;
      }
      if (branchId) {
        query.branchId = branchId;
      }
      if (service) {
        query.service = service;
      }
      if (departmentId) {
        query.departmentId = departmentId;
      }
      if (status) {
        query.status = status;
      }
      const listData = await Schedule.find(query).populate('doctorId', 'fullName');
      // const listData = await Schedule.find(query);
      res.json(listData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const existingObject = await Schedule.findById(id);
      if (!existingObject) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      await Schedule.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const {
        doctorId,
        id,
        service,
        price,
        date,
        status,
        time,
        note,
      } = req.body;
      const existingObject = await Schedule.findById(id);
      if (existingObject) {
        if (time) {
          const overlappingSchedule = await Schedule.findOne({
            doctorId: doctorId,
            $or: [
              {
                $and: [
                  { date: date },
                  {
                    $or: [
                      { timeStart: { $lte: time[0] }, timeEnd: { $gt: time[0] } }, // Thời gian bắt đầu mới chồng lấn
                      { timeStart: { $lt: time[1] }, timeEnd: { $gte: time[1] } }, // Thời gian kết thúc mới chồng lấn
                      { $and: [{ timeStart: { $gte: time[0] } }, { timeEnd: { $lte: time[1] } }] } // Lịch hẹn mới hoàn toàn bao gồm trong lịch khác
                    ]
                  }
                ]
              },
              {
                $and: [
                  { date: { $ne: date } },
                  {
                    $or: [
                      { $and: [{ timeStart: { $lt: time[0] } }, { timeEnd: { $gt: time[0] } }] }, // Lịch hẹn mới bắt đầu trong khoảng thời gian của lịch khác
                      { $and: [{ timeStart: { $lt: time[1] } }, { timeEnd: { $gt: time[1] } }] }, // Lịch hẹn mới kết thúc trong khoảng thời gian của lịch khác
                      { $and: [{ timeStart: { $gte: time[0] } }, { timeEnd: { $lte: time[1] } }] } // Lịch hẹn mới hoàn toàn bao gồm trong lịch khác
                    ]
                  }
                ]
              }
            ]
          });
          if (overlappingSchedule) {
            return res.status(210).json({
              message: "Thời gian lịch khám bị trùng lấn.",
              schedule: {
                overlappingTimeStart: overlappingSchedule.timeStart,
                overlappingTimeEnd: overlappingSchedule.timeEnd,
              }
            });
          }
          existingObject.timeStart = time[0]
          existingObject.timeEnd = time[1]
        }
        if (date) {
          existingObject.date = date
        }
        if (service) {
          existingObject.service = service
        }
        if (price) {
          existingObject.price = price
        }
        if (status) {
          existingObject.status = status
        }
        if (note) {
          existingObject.note = note
        }
        // Lưu thay đổi22
        await existingObject.save();
        // Trả về thông tin tài khoản đã cập nhật
        return res.status(200).json(existingObject);
      }
      // Trả về lỗi nếu tài khoản không tồn tại
      return res.status(404).json({ error: 'Schedule not found' });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = scheduleController;
