// Import required modules
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const tripRoutes = require('./routes/trips');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shuttleTrips')
    .then(() => {
        console.log('MongoDB connection established successfully');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB');
        console.log(err);
    });

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/trips', tripRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
