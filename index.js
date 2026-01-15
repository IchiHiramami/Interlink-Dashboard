require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use('/', userRoutes);
app.use('/', authRoutes)

// Test if the server is running
app.get('/' ,async (req,res) => {
    res.send('Dashboard API is running');
});

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const port = process.env.port || 8080;
        app.listen(port, () => {
            console.log(`App is listening at port ${port}`);
        }); 
    } catch (error) {
        console.error('Database connection error:', error)
    }
};

start();