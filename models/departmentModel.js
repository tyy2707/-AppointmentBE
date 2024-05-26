
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    branchId:{
        type: String
    },
    doctorIds: {
        type: [String]
    }
});

module.exports = mongoose.model('Department', userSchema);
