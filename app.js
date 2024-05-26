const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const accountRoutes = require('./routes/account.routes');
const app = express();

// Kết nối với cơ sở dữ liệu MongoDB
connectDB();


app.use(express.json());
// Cấu hình CORS
app.use(cors());

// Đăng ký các tuyến đường
app.use('/account', accountRoutes);

app.listen(4096, () => {
    console.log('Server is running on port 4096');
});
