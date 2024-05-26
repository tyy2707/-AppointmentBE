
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    },
    status: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    feedback_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    blood_pressure: {
        type: Number,
    },
    temperature: {
        type: Number,
    },
    respiratory_rate: {
        type: Number,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    left_eye_power: {
        type: Number,
    },

    right_eye_power: {
        type: Number,
    },

    systolic_bp: {
        type: Number,
    },

    diastolic_bp: {
        type: Number,
    },

    diagnosis: {
        type: String,
    },
    symptom: {
        type: String,
    },
    note: {
        type: String,
    },
    prescription: {
        type: String,
    },
});

module.exports = mongoose.model('Booking', userSchema);
