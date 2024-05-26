
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    province: {
        type: Number,
    },
    image: {
        type: String,
    },
    address: {
        type: String,
    },
});

module.exports = mongoose.model('Branch', userSchema);
