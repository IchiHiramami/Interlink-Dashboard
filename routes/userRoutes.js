const express = require('express');
const router = express.Router();
const User = require('../models/User').User;
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// return user-info on /dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    console.log('get dashboard pinged')
    const user = await User.findById(req.user.id || req.user.email);
    res.json({
      email : user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      groupName: user.groupName,
      groupProgress: user.groupProgress
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

router.get('/users/stats', auth, async (req, res) => {
  try {
    console.log('stats retrieved');
    const user = await User.findById(req.user.id);
    res.json({
      groupName: user.groupName,
      groupProgress: user.groupProgress,
      role : user.role
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

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