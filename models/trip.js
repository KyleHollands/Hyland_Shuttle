// Initialize Mongoose
const mongoose = require('mongoose'); // Import mongoose module

// Define the schema for a trip
const tripSchema = new mongoose.Schema({
    tripDate: {
        type: Date,
        required: true // Trip date is required
    },
    trips: [{
        firstName: {
            type: String,
            required: true // First name is required
        },
        lastName: {
            type: String,
            required: true // Last name is required
        },
        phoneNumber: {
            type: String,
            required: true // Phone number is required
        },
        email: {
            type: String,
            required: false // Email is optional
        },
        numberOfPassengers: {
            type: Number,
            required: true // Number of passengers is required
        },
        pickupLocation: {
            type: String,
            enum: [
                'Haliburton', 'Allsaw', 'Minden', 'Miners Bay', 'Moore Falls', 'Norland',
                'Coboconk', 'Rosedale', 'Fenelon Falls', 'Cameron', 'Lindsay',
                'Hwy. 35 & 7A', 'Hwy 2 @ Hwy 35/115 Park & Ride', 'Bowmanville',
                'Courtice', 'Oshawa', 'Scarborough', 'Toronto'
            ], // Allowed pickup locations
            required: true // Pickup location is required
        },
        dropoffLocation: {
            type: String,
            enum: [
                'Haliburton', 'Allsaw', 'Minden', 'Miners Bay', 'Moore Falls', 'Norland',
                'Coboconk', 'Rosedale', 'Fenelon Falls', 'Cameron', 'Lindsay',
                'Hwy. 35 & 7A', 'Hwy 2 @ Hwy 35/115 Park & Ride', 'Bowmanville',
                'Courtice', 'Oshawa', 'Scarborough', 'Toronto'
            ], // Allowed dropoff locations
            required: true // Dropoff location is required
        },
        direction: {
            type: String,
            enum: ['Northbound', 'Southbound'], // Allowed directions
            required: true // Direction is required
        }
    }]
});

// Create a model from the schema
const Trip = mongoose.model('Trip', tripSchema);

// Export the model
module.exports = Trip; // Export the model
