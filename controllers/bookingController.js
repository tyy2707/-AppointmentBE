const accountModel = require('../models/accountModel');
const bookingModel = require('../models/bookingModel');
const Booking = require('../models/bookingModel');
const branchModel = require('../models/branchModel');
const departmentModel = require('../models/departmentModel');
const feedbackModel = require('../models/feedbackModel');
const patientModel = require('../models/patientModel');
const scheduleModel = require('../models/scheduleModel');


async function getDetailBookingFull(data, UserId, DoctorId) {
    let result = { ...data }
    let shiftInfo = {}
    const shift = await scheduleModel.findById(data.shiftId).lean()
    result.doctorId = shift.doctorId
    result.doctorName = shift.doctorId
    if (DoctorId) {
        if (DoctorId === shift.doctorId.toString()) {
            shiftInfo = shift
        } else {
            return null
        }
    }
    else {
        shiftInfo = shift
    }
    const branchInfo = await branchModel.findById(shiftInfo.branchId).lean()
    const doctorInfo = await accountModel.findById(shiftInfo.doctorId).lean()
    let userInfo = await accountModel.findById(data.user_id).lean()
    if (UserId) {
        if (UserId === userInfo._id.toString()) {
            userInfo = userInfo
        } else {
            return null
        }
    }
    const patientInfo = await patientModel.findById(data.patientId).lean()
    result.shiftInfo = shiftInfo
    result.address = branchInfo.address
    result.patientInfo = patientInfo
    result.phoneUser = userInfo.phone
    result.doctorInfo = {
        fullName: doctorInfo.fullName,
        avatar: doctorInfo.avatar,
        age: doctorInfo.age,
        gender: doctorInfo.gender,
        academicRank: doctorInfo.academicRank,
        specialize: doctorInfo.specialize
    }
    if (data.feedback_id) {
        const feedBackInfo = await feedbackModel.findById(data.feedback_id).lean()
        result.feedBackInfo = feedBackInfo
    }
    return result
}
const bookingController = {
    createBooking: async (req, res) => {
        try {
            const {
                user_id,
                patientId,
                shiftId,
                price,
                status
            } = req.body;

            const excludingShiftID = await scheduleModel.findById(shiftId)
            if (excludingShiftID) {
                excludingShiftID.status = 4;
                const savedSchedule = await excludingShiftID.save();
                const newBooking = new Booking({
                    user_id,
                    patientId,
                    price,
                    shiftId,
                });
                // Lưu booking vào cơ sở dữ liệu
                const savedBooking = await newBooking.save();
                // Trả về dữ liệu đã lưu
                res.status(201).json(savedBooking);
            } else {
                res.status(202).json('Không tồn tại ca khám');
            }
            // Tạo mới một đối tượng Booking

        } catch (err) {
            // Xử lý lỗi nếu có
            res.status(500).json({ message: err.message });
        }
    },
    getDetailBooking: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Booking.findById(id).lean();
            if (data) {
                const item = await getDetailBookingFull(data)
                res.json(item);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getOverView: async (req, res) => {
        try {
            // Count the total number of bookings
            const bookingCount = await bookingModel.countDocuments();

            // Count the total number of patients
            const patientCount = await patientModel.countDocuments();

            // Count the total number of accounts with role = 2
            const accountCount = await accountModel.countDocuments({ role: 2 });

            // Count the total number of branches
            const branchCount = await branchModel.countDocuments();

            // Count the total number of departments
            const departmentCount = await departmentModel.countDocuments();

            // Return the counts as an overview object
            res.json({
                bookingCount,
                patientCount,
                accountCount,
                branchCount,
                departmentCount
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getListBooking: async (req, res) => {
        try {
            const { Keyword, UserId, DoctorId } = req.query;
            let query = {};
            let result = [];
            const listData = await Booking.find(query).lean();
            for (const element of listData) {
                const item = await getDetailBookingFull(element, UserId, DoctorId);
                if (item) {
                    result.push(item);
                }
            }
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    ////////////////////////////////////////////////////////////////

    updateBooking: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                status,
                diagnosis,
                systolic_bp,
                diastolic_bp,
                temperature,
                height,
                left_eye_power,
                right_eye_power,
                weight,
                respiratory_rate,
                symptom,
                prescription,
                note
            } = req.body;
            // Kiểm tra xem booking có tồn tại không
            const existingBooking = await Booking.findById(id);
            if (!existingBooking) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            if (diagnosis) {
                existingBooking.diagnosis = diagnosis;
            }
            if (systolic_bp) {
                existingBooking.systolic_bp = parseFloat(systolic_bp);
            }
            if (diastolic_bp) {
                existingBooking.diastolic_bp = parseFloat(diastolic_bp);
            }
            if (temperature) {
                existingBooking.temperature = parseFloat(temperature);
            }
            if (height) {
                existingBooking.height = height;
            }
            if (left_eye_power) {
                existingBooking.left_eye_power = left_eye_power
            }
            if (right_eye_power) {
                existingBooking.right_eye_power = right_eye_power
            }
            if (weight) {
                existingBooking.weight = weight
            }
            if (respiratory_rate) {
                existingBooking.respiratory_rate = respiratory_rate
            }
            if (symptom) {
                existingBooking.symptom = symptom
            }
            if (note) {
                existingBooking.note = note
            }
            if (prescription) {
                existingBooking.prescription = prescription
            }
            // Cập nhật thông tin booking
            existingBooking.status = status;
            // Lưu thông tin cập nhật
            const updatedBooking = await existingBooking.save();
            // Trả về thông tin booking đã cập nhật
            res.status(200).json(updatedBooking);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    deleteBooking: async (req, res) => {
        try {
            const { _id } = req.body;
            // Kiểm tra xem Booking tồn tại không
            const existingBooking = await Booking.findById(_id);
            if (!existingBooking) {
                // Nếu Booking không tồn tại, trả về lỗi
                return res.status(404).json({ error: 'Booking not found' });
            }

            // Nếu Booking tồn tại, tiến hành xóa
            await Booking.findByIdAndDelete(_id);
            // Trả về thông báo thành công
            return res.status(200).json({ message: 'Booking deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getChart: async (req, res) => {
        const { Year, Month, Status } = req.query
        try {
            let pipeline = [];


            if (!Month && Year) {
                if (Status !== null) {
                    pipeline.push({
                        $match: {
                            created_at: {
                                $gte: new Date(Year, 0, 1), // Ngày bắt đầu của năm
                                $lt: new Date(Year + 1, 0, 1) // Ngày kết thúc của năm
                            },
                            status: parseInt(Status)
                        }
                    },);
                } else {
                    pipeline.push({
                        $match: {
                            created_at: {
                                $gte: new Date(Year, 0, 1), // Ngày bắt đầu của năm
                                $lt: new Date(Year + 1, 0, 1) // Ngày kết thúc của năm
                            },
                        }
                    },);
                }
                pipeline.push(
                    {
                        $match: {
                            created_at: {
                                $gte: new Date(Year, 0, 1), // Ngày bắt đầu của năm
                                $lt: new Date(Year + 1, 0, 1) // Ngày kết thúc của năm
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: '$created_at' }, // Lấy tháng từ trường created_at
                            bookings: { $sum: 1 }, // Đếm số lượng booking trong mỗi tháng
                            total_price: { $sum: '$price' } // Tính tổng giá tiền trong mỗi tháng
                        }
                    },
                    {
                        $sort: { '_id': 1 } // Sắp xếp theo tháng tăng dần
                    },
                    {
                        $project: {
                            _id: 0, // Loại bỏ trường _id
                            month: '$_id', // Sử dụng tháng làm giá trị của trường month
                            bookings: 1, // Giữ nguyên trường bookings
                            total_price: 1 // Giữ nguyên trường total_price
                        }
                    }
                );
            }
            else {
                if (Status !== null) {
                    pipeline.push({
                        $match: {
                            created_at: {
                                $gte: new Date(Year, parseInt(Month - 1), 1), // Ngày bắt đầu của tháng
                                $lt: new Date(Year, parseInt(Month), 1) // Ngày kết thúc của năm
                            },
                            status: parseInt(Status)
                        }
                    },);
                } else {
                    pipeline.push({
                        $match: {
                            $gte: new Date(Year, parseInt(Month - 1), 1), // Ngày bắt đầu của tháng
                            $lt: new Date(Year, parseInt(Month), 1)
                        }
                    },);
                }
                pipeline.push(
                    {
                        $match: {
                            created_at: {
                                $gte: new Date(Year, parseInt(Month - 1), 1), // Ngày bắt đầu của tháng
                                $lt: new Date(Year, parseInt(Month), 1) // Ngày kết thúc của tháng
                            }
                        }
                    },
                    {
                        $addFields: {
                            fullDate: {
                                $dateToString: { format: "%Y-%m-%d", date: "$created_at" } // Tạo trường mới fullDate chứa ngày đầy đủ
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$fullDate", // Nhóm theo ngày tạo booking (ngày đầy đủ)
                            bookings: { $sum: 1 }, // Đếm số lượng booking trong mỗi ngày
                            total_price: { $sum: '$price' } // Tính tổng giá tiền trong mỗi ngày
                        }
                    },
                    {
                        $sort: { '_id': 1 } // Sắp xếp theo ngày tăng dần
                    },
                    {
                        $project: {
                            _id: 0, // Loại bỏ trường _id
                            date: '$_id', // Sử dụng ngày làm giá trị của trường date
                            bookings: 1, // Giữ nguyên trường bookings
                            total_price: 1 // Giữ nguyên trường total_price
                        }
                    }
                )
            }
            const result = await Booking.aggregate(pipeline);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getTopBookingDoctor: async (req, res) => {
        const { Year, Month, Status } = req.query
        try {
            let pipeline = [];
            if (Year) {
                const matchStage = {
                    $match: {
                        created_at: {
                            $gte: new Date(Year, Month ? parseInt(Month - 1) : 0, 1), // Ngày bắt đầu của năm hoặc tháng
                            $lt: Month ? new Date(Year, parseInt(Month), 1) : new Date(Year + 1, 0, 1) // Ngày kết thúc của tháng hoặc năm
                        }
                    }
                };

                if (Status !== undefined) {
                    matchStage.$match.status = parseInt(Status);
                }

                pipeline.push(matchStage);
            }
            let listBooking = []
            const list = await Booking.aggregate(pipeline);

            for (const element of list) {
                const item = await getDetailBookingFull(element);
                if (item) {
                    listBooking.push(item);
                }
            }

            const groupedBookings = listBooking.reduce((acc, booking) => {
                if (!acc[booking.doctorId]) {
                    acc[booking.doctorId] = [];
                }
                acc[booking.doctorId].push(booking);
                return acc;
            }, {});

            // Bước 2: Đếm số lượng lượt booking của mỗi bác sĩ
            const doctorBookingCounts = Object.keys(groupedBookings).map((doctorId) => ({
                doctorId,
                bookingCount: groupedBookings[doctorId].length
            }));

            // Bước 3: Sắp xếp các bác sĩ theo số lượng lượt booking giảm dần
            doctorBookingCounts.sort((a, b) => b.bookingCount - a.bookingCount);

            // Bước 4: Chọn ra top các bác sĩ có số lượng lượt booking cao nhất (ví dụ: top 3)
            const topDoctors = doctorBookingCounts.slice(0, 3);
            const finalResult = [];
            for (const doctor of topDoctors) {
                const account = await accountModel.findById(doctor.doctorId);
                if (account) {
                    finalResult.push({
                        doctorId: doctor.doctorId,
                        fullName: account.fullName,
                        bookingCount: doctor.bookingCount
                    });
                }
            }
            return res.status(200).json(finalResult);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

}
module.exports = bookingController;