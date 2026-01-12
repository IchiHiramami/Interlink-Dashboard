const express = require('express');
const router = express.Router();
const User = require('../models/User');

// router for users creation, defaults are that email is unique, idNumber is required as it is for every UP service
router.post('/', async (req, res) => {
  try {
    const {email, firstName, lastName, idNumber, role} = req.body;

    if (!email || !firstName || !lastName || !idNumber) {
      return res.status(400).json({error : 'email, firstname and lastname, and idNumber (UP idNumber are required'});
    }

    const user = await User.create({
      email,
      firstName,
      lastName,
      idNumber,
      role: role || 'user',
      groupName: '',
      groupProgress : 0
    });

    res.status(201).json(user);
  } catch(err) {
    if (err.code == 1100) {
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
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

// user role can update name and idNumber here (for very specific instances only)
router.put('/email/:email', async (req, res) => {
  try {
    const { name, idNumber } = req.body //allowable changeable fields
    const update = {};

    if (typeof name === 'string') update.name = name.trim();
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
router.put('/admin/email/:email', async (req, res) =>{
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
router.delete('/email/:email', async (res, req) => {
  try {
    const user = await User.findOneAndDelete({ email : req.params.email.trim()});
    if (!user) return res.status(404).json({ error : 'No user with such email found'});
    res.json({message: 'User successfully deleted!'})
  } catch (err) {
    res.status(500).json({error : err.message})
  }
});

module.exports = router;