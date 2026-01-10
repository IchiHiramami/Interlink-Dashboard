require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Use routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);
app.listen(3000, () => console.log('Server running at port', process.env.PORT));
