// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        minlength: [3, 'Title should have at least 3 characters'],
    },
    description: {
        type: String,
        maxlength: [500, 'Description should be 500 characters or less'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    completed: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Create an index on priority to improve search performance for prioritized tasks
taskSchema.index({ priority: 1 });

// Export the Task model based on the taskSchema
module.exports = mongoose.model('Task', taskSchema);
