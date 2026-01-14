const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// router for users creation, defaults are that email is unique, idNumber is required as it is for every UP service
router.post('/register', async (req, res) => {
    try {
    const {email, firstName, lastName, idNumber, password} = req.body;

    const requiredFields = { email, firstName, lastName, idNumber, password }; 
    for (const [field, value] of Object.entries(requiredFields)) { 
        if (!value || value.trim() === '') 
                { return res.status(400).json({ error: `${field} is required` }); 
        } 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
            email,
            firstName,
            lastName,
            idNumber,
            password : hashedPassword,
            role: req.body.role || 'user',
            groupName: '',
            groupProgress : 0
        }
    )
        console.log('Successful registration')
        return res.status(201).json({ message: `Successfully created ${user}`})
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: `${user} does not exist`});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid Credentials'});

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role}, JWT_SECRET, { expiresIn: '1h'});
        console.log("Successful Login")
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router