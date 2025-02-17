const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const tripRoutes = require('./routes/trips'); // Import the trip routes

// ====================
// Database Connection
// ====================
mongoose.connect('mongodb://localhost:27017/shuttleTrips')
    .then(() => {
        console.log('Mongo Connection Open'); // Log success message if connection is successful
    })
    .catch(err => {
        console.log('Mongo Connection Error'); // Log error message if connection fails
        console.log(err); // Log the error details
    });

// Use the public directory for static files
app.use(express.static(path.join(__dirname)));

// ====================
// App Configuration
// ====================
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Set the view engine to ejs
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// ====================
// Trip Route Handling
// ====================
app.use('/trips', tripRoutes); // Use the trip routes

// ====================
// Server Configuration
// ====================
app.listen(3000, () => {
    console.log('Listening on port 3000'); // Log message when server starts
});
