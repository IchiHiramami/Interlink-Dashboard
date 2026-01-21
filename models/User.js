const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, trim: true},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    idNumber: {type: String, required: true, trim: true},
    password : {type: String, required: true, trim: true},
    
    role: {type: String, enum: ['user', 'admin'], default: 'user'},

    //Admin controlled details
    groupName: {type: String, default: '', trim: true},
    groupProgress: {type: Number, default: 0, min: 0}
}, {timestamps: true}, { collection : 'information'});

userSchema.index({idNumber: 1});

const postSchema = new mongoose.Schema({
    title : {type: String, required : true, trim: true},
    content : {type: String, required : true},
    createdAt : {type : Date, default : Date.now}
}, { collection : 'posts'});

const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', postSchema)

module.exports = {User, Task};