const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// FORCE MOCK MODE FOR DEMO
// FORCE MOCK MODE FOR DEMO
global.MOCK_MODE = true;
global.MOCK_USERS = []; // Store registered users in memory
global.MOCK_PROGRAMS = [];
global.MOCK_COURSES = [];
global.MOCK_FACULTY = [];
global.MOCK_ROOMS = [];
console.log('⚠️ FORCING MOCK MODE ON STARTUP');

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected (Local)');
    } catch (err) {
        console.error('Local MongoDB Connection Failed:', err.message);
        console.log('Attempting to start In-Memory MongoDB...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB Connected (In-Memory Fallback)');

            // Seed data for in-memory instance
            const User = require('./models/User');
            const adminExists = await User.findOne({ email: 'admin@example.com' });
            if (!adminExists) {
                await User.create({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'password123',
                    role: 'admin'
                });
                console.log('In-Memory DB Seeded with Admin User');
            }

        } catch (memErr) {
            console.error('In-Memory MongoDB Failed:', memErr.message);
            console.warn('⚠️ CRITICAL: ALL DATABASE CONNECTIONS FAILED.');
            console.warn('⚠️ SWITCHING TO MOCK MODE. DATA WILL NOT BE SAVED.');
            global.MOCK_MODE = true;
        }
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/data', require('./routes/data.routes'));
app.use('/api/timetable', require('./routes/timetable.routes'));
app.use('/api/leaves', require('./routes/leave.routes'));
app.get('/', (req, res) => {
    res.send('NEP 2020 Timetable Generator API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
