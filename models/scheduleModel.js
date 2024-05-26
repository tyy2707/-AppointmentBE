
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    service: Number,
    price: Number,
    status: {
        type: Number,
        default: 1
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    departmentName: {
        type: String,
        required: true
    },
    branchName: {
        type: String,
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    date: Date,
    timeStart: Date,
    timeEnd: Date,
    note: String
});

module.exports = mongoose.model('Schedule', userSchema);
