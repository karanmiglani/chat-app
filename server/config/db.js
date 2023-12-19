const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        

        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/livechat");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
