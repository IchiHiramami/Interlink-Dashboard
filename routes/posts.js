const express = require('express');
const router = express.Router();
const Task = require('../models/User').Task;
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// handle tasks creation and posting
router.post('/tasks', async (req, res) => {
    try {
        const { title, content , createdAt } = req.body;

        const task = await Task.create({
            title,
            content,
            createdAt,
        });
        console.log('Task created successfully');

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message })   
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;