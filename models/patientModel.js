
const AvatarDefault = 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg'
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    fullName: String,
    address: {
        type: String,
    },
    province: Number,
    district: Number,
    status: {
        type: Number,
        default: 10,
    },
    age: {
        type: Number,
        default: 22,
    },
    ward: Number,
    dateOfBirth: Date,
    gender: {
        type: String,
        default: 'Male',
        enum: ['Male', 'Female']
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 11,
        // unique: true
    },
    email: {
        type: String,
        maxlength: 30,
    },
    CCCD: {
        type: String,
        unique: true
    },
    nation: {
        type: String,
    },
    job: {
        type: String,
    },
    avatar: {
        type: String,
        default: AvatarDefault
    }
});

module.exports = mongoose.model('Patient', userSchema);
