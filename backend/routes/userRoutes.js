const express = require('express');
const router = express.Router();
const User = require('../routes/userRoutes');

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ userId: req.params.id });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.get('/admin/all', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
