const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/nep_timetable';

console.log('Attempting to connect to:', MONGO_URI);

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        process.exit(1);
    });
