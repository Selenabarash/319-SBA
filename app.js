/* require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); */



//

//const Task = require('./models/Task');

/* Create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}); */

// Read all tasks or filter by priority/completed status
/* app.get('/api/tasks', async (req, res) => {
    try {
        const { priority, completed } = req.query;
        const query = {};
        if (priority) query.priority = priority;
        if (completed) query.completed = completed === 'true';
        const tasks = await Task.find(query);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); */

// Update a task by ID
/* app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}); */

// Delete a task by ID
/* app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); */


// Import required packages and configurations
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task'); // Import Task model from models directory

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

// CRUD API Routes

// 1. Create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save(); // Save new task to the database
        res.status(201).json(task); // Send the created task as JSON
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. Read all tasks or filter by priority and completed status
app.get('/api/tasks', async (req, res) => {
    try {
        const { priority, completed } = req.query; // Optional query parameters
        const query = {}; // Initialize an empty query object

        // Apply filters if they exist in the request
        if (priority) query.priority = priority;
        if (completed) query.completed = completed === 'true';

        const tasks = await Task.find(query); // Find tasks matching query
        res.status(200).json(tasks); // Send found tasks as JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Update a task by ID
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task); // Send updated task as JSON
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. Delete a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(204).send(); // No content response after deletion
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// html 
// Serve static files from the "public" directory
app.use(express.static('public'));

// client side JS
// Elements
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskPriority = document.getElementById('task-priority');
const taskList = document.getElementById('task-list');

// Fetch tasks from the API and display them
async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    taskList.innerHTML = ''; // Clear list

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) taskItem.classList.add('completed');

        taskItem.innerHTML = `
            <span>${task.title} - ${task.priority}</span>
            <button onclick="deleteTask('${task._id}')">Delete</button>
            <button onclick="toggleComplete('${task._id}', ${task.completed})">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Add a new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTask = {
        title: taskTitle.value,
        priority: taskPriority.value,
        completed: false
    };

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });

    taskTitle.value = ''; // Clear input
    fetchTasks(); // Reload tasks
});

// Delete a task
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks(); // Reload tasks
}

// Toggle task completion
async function toggleComplete(id, currentStatus) {
    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
    });
    fetchTasks(); // Reload tasks
}

// Initial fetch of tasks
fetchTasks();
