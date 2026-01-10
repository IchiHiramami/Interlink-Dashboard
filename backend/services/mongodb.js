
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

const userSChema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    name: {type: String, requred: true},
    email: {type: String, requred: true, unique: true},

    role: {type: String, enum: ['user', 'admin'], default: 'user'},

    lastCheckIn: {type: Date, default: Date.now},

    status: {type: String, enum: ['active', 'inactive', 'banned'], default: 'active'},
}, {timestamps: true});

module.exports = mongoose.model('User', userSChema);