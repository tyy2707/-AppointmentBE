const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    comment: String,
    departmentName: String,
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    shift_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    patient_avatar: String,
    patient_name: String,
    star: Number,
    star: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', userSchema);
