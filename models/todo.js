const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now   
    }
});

module.exports = mongoose.model('Todo', todoSchema);