const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const accountRoutes = require('./routes/account.routes');
const patientRoutes = require('./routes/patient.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const bookingRoutes = require('./routes/bookingRoutes');
const branchRoutes = require('./routes/branchRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const feedbackRoutes = require('./routes/feedback.routes');
const questionRoutes = require('./routes/question.routes');

const app = express();

// Kết nối với cơ sở dữ liệu MongoDB
connectDB();


app.use(express.json());
// Cấu hình CORS
app.use(cors());

// Đăng ký các tuyến đường
app.use('/account', accountRoutes);
app.use('/patient', patientRoutes);
app.use('/booking', bookingRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/branches', branchRoutes);
app.use('/department', departmentRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/question', questionRoutes);

app.listen(4096, () => {
    console.log('Server is running on port 4096');
});
