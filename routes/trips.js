// ====================
// This file contains the routes for the trips resource.
// ====================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Trip = require('../models/trip');
const { adjustTripDate, determineDirection } = require('../script.js');
const catchAsync = require('../utilities/catch_async_wrapper');

// ====================
// Route Handlers
// ====================

// Render the home page
router.get('/', (req, res) => {
    res.render('trips/index');
});

// Render the page with all trip dates
router.get('/allDates', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/allDates', { trips });
}));

// Render the page to create a new trip
router.get('/new', (req, res) => {
    res.render('trips/new');
});

// Handle lookup of a specific passenger trip by ID
router.post('/lookup', catchAsync(async (req, res) => {
    const { tripId } = req.body; // This is the passenger trip ID
    const trip = await Trip.findOne({ 'trips._id': tripId });
    if (trip) {
        console.log("Parent Trip ID:", trip._id); // Log the parent trip ID
        console.log("Passenger Trip ID:", tripId); // Log the passenger trip ID
        console.log(trip); // Log the trip object
        res.render('trips/confirmation', { trip, passenger: trip.trips.id(tripId) });
    } else {
        res.status(404).send('Booking ID not found!');
    }
}));

// Render the lookup page for a specific passenger trip by ID
router.get('/lookup', (req, res) => {
    res.render('trips/lookup');
});

// Render the details of a specific trip by ID
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params; // This is the parent trip ID
    const trip = await Trip.findById(id);
    console.log("Parent Trip ID:", id); // Log the parent trip ID
    console.log(trip); // Log the trip object
    res.render('trips/dateDetails', { trip });
}));

// Handle form submission to create or update a trip
router.post('/allDates', catchAsync(async (req, res) => {
    let { tripDate, pickupLocation, dropoffLocation, ...otherData } = req.body;

    // Adjust the tripDate to the correct timezone (e.g., UTC-5 for EST)
    let adjustedTripDate = adjustTripDate(tripDate);

    // Determine the direction based on pickup and dropoff locations
    let direction = determineDirection(pickupLocation, dropoffLocation);

    // Create the passenger data object
    const passengerData = {
        _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the passenger
        ...otherData,
        pickupLocation,
        dropoffLocation,
        direction
    };

    // Check if a trip with the same date already exists
    const existingTrip = await Trip.findOne({ tripDate: adjustedTripDate });
    if (existingTrip) {
        // Append the new passenger information to the existing trip
        existingTrip.trips.push(passengerData);
        await existingTrip.save();
        res.render('trips/confirmation', { trip: existingTrip, passenger: passengerData });
    } else {
        // Create a new Trip instance with the modified request body
        const newTrip = new Trip({
            tripDate: adjustedTripDate,
            trips: [passengerData]
        });
        await newTrip.save();
        res.render('trips/confirmation', { trip: newTrip, passenger: passengerData });
    }
}));

// If an error occurs, send a generic error message
router.use((err, req, res, next) => {
    res.send('Something went wrong!')
});

// ====================
// Export the router
// ====================
module.exports = router;