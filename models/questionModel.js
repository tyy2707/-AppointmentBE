
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        default: 'Male',
        enum: ['Male', 'Female', 'Other']
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    content: {
        type: String,
    },
    reply: {
        type: String,
    },
    user_id: {
        type: String,
    },
    doctor_id: {
        type: String,
    },
    title: {
        type: String,
    },
    status: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }
});

module.exports = mongoose.model('Question', userSchema);
