
const mongoose = require('mongoose');


// ca khám
const userSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: Date,
    },
    doctorId: {
        type: Number,
    },
    type: {
        type: Number,
    }
});

module.exports = mongoose.model('Appointment ', userSchema);
