const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// router for users creation, defaults are that email is unique, idNumber is required as it is for every UP service
router.post('/', async (req, res) => {
  try {
    const {email, firstName, lastName, idNumber, password} = req.body;

    if (!email || !firstName || !lastName || !idNumber || !password) {
      return res.status(400).json({error : 'Some required fields are missing'});
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
    });

// login authentication route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({error : 'User does not exist' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid Credentials' })

  const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
  res.json({ token })
})

    res.status(201).json(user);
  } catch(err) {
    if (err.code == 11000) {
      return res.status(409).json({error: 'User with that email already exists, contact admin to delete record'});
    }
    res.status(500).json({error: err.message});
  }
})

// find a user using email as query parameter
router.get('/', async (req, res) => {
  try {
    const {email} = req.query;
    if (!email) {
      const users = await User.find();
      return res.json(users);
    }
    const user = await User.findOne({ email: email.trim()});
    if (!user) return res.status(404).json({error: 'User not found'});

    return res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

// user role can update name and idNumber here (for very specific instances only)
router.put('/email/:email', auth , async (req, res) => {
  try {
    const { firstName, lastName, idNumber } = req.body //allowable changeable fields
    const update = {};

    if (typeof firstName === 'string') update.firstName = firstName.trim();
    if (typeof lastName === 'string') update.lastName = lastName.trim();
    if (typeof idNumber === 'string') update.idNumber = idNumber.trim();

    const user = await User.findOneAndUpdate(
      {email : req.params.email.trim()},
      {$set : update},
      {new: true}
    );

    if (!user) return res.status(404).json({ error: 'User not found'});
    res.json(user);
  }
    catch (err) {
      res.status(500).json({ error: err.message});
    }
  });

// admin-only updates via email parameter
router.put('/admin/email/:email', auth, async (req, res) =>{
  try {
    const user = await User.findOneAndUpdate(
      {email : req.params.email.trim()},
      {$set: req.body},
      {new: true}
    );
    
    if (!user) return res.status(404).json({ error: 'User does not exist'})
    res.json(user);
  } catch (err) {
    res.status(500).json({error : err.message});
  }
});

// User deletion by email
router.delete('/email/:email', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email : req.params.email.trim()});
    if (!user) return res.status(404).json({ error : 'No user with such email found'});
    res.json({message: 'User successfully deleted!'})
  } catch (err) {
    res.status(500).json({error : err.message})
  }
});

module.exports = router;