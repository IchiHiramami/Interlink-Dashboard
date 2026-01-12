const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true, trim: true},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    idNumber: {type: String, required: true, trim: true},

    role: {type: String, enum: ['user', 'admin'], default: 'user'},

    //Admin controlled details
    groupName: {type: String, default: '', trim: true},
    groupProgress: {type: Number, default: 0, min: 0}
}, {timestamps: true});

userSchema.index({idNumber: 1});

module.exports = mongoose.model('User', userSchema)