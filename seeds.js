const mongoose = require('mongoose'); // Import mongoose module
const Trip = require('./models/trip'); // Import the Trip model

mongoose.connect('mongodb://localhost:27017/shuttleTrips')
    .then(() => {
        console.log('Mongo Connection Open'); // Log success message if connection is successful
    })
    .catch(err => {
        console.log('Mongo Connection Error'); // Log error message if connection fails
        console.log(err); // Log the error details
    });

Trip.insertMany(seedTrips)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    });