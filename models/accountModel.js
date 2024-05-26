
const AvatarDefault = 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg'
const ImageDefault = 'https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullName: String,
    address: {
        type: String,
        default: '8 hà văn tính, hoà khánh bắc',
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
        enum: ['Male', 'Female', 'Other']
    },
    phone: {
        type: String,
        minlength: 9,
        maxlength: 11,
        unique: true,
        required: true
    },
    email: {
        type: String,
        maxlength: 30,
        unique: true
    },
    position: String,
    academicRank: String,
    degree: [{
        type: String
    }],
    introduction: String,
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    avatar: {
        type: String,
        default: AvatarDefault
    },
    specialize: [{
        type: String
    }],
    experience: [{
        type: String
    }],
});

module.exports = mongoose.model('Account', userSchema);
