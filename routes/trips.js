const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Trip = require('../models/trip');
const ExpressError = require('../utilities/expressError.js');
const { tripSchemaValidation } = require('../utilities/schemaValidation.js');
const { adjustTripDate, determineDirection } = require('../script.js');
const catchAsync = require('../utilities/catchAsyncErrorWrapper.js');

// Middleware to validate trip data
const validateTripData = (req, res, next) => {
    const { error } = tripSchemaValidation.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(err => err.message).join(','), 400);
    } else {
        next();
    }
};

// Route to render the main trips page
router.get('/', (req, res) => {
    res.render('trips/index');
});

// Route to render all trips with their dates
router.get('/allDates', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/allDates', { trips });
}));

// Route to render the form for creating a new trip
router.get('/new', (req, res) => {
    res.render('trips/new');
});

// Route to render the trip lookup form
router.get('/lookup', (req, res) => {
    res.render('trips/lookup');
});

// Route to handle trip lookup by trip ID
router.post('/lookup', catchAsync(async (req, res) => {
    const { tripId } = req.body;
    const trip = await Trip.findOne({ 'trips._id': tripId });
    if (trip) {
        console.log("Parent Trip ID:", trip._id);
        console.log("Passenger Trip ID:", tripId);
        console.log(trip);
        res.render('trips/confirmation', { trip, passenger: trip.trips.id(tripId) });
    } else {
        res.status(404).send('Booking ID not found!');
    }
}));

// Route to render details of a specific trip by ID
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    console.log("Parent Trip ID:", id);
    console.log(trip);
    res.render('trips/dateDetails', { trip });
}));

// Route to handle the creation of a new trip or adding a passenger to an existing trip
router.post('/allDates', validateTripData, catchAsync(async (req, res) => {

    let { tripDate, pickupLocation, dropoffLocation, ...otherData } = req.body;
    let adjustedTripDate = adjustTripDate(tripDate);
    let direction = determineDirection(pickupLocation, dropoffLocation);
    const passengerData = {
        _id: new mongoose.Types.ObjectId(),
        ...otherData,
        pickupLocation,
        dropoffLocation,
        direction
    };
    const existingTrip = await Trip.findOne({ tripDate: adjustedTripDate });
    if (existingTrip) {
        existingTrip.trips.push(passengerData);
        await existingTrip.save();
        res.render('trips/confirmation', { trip: existingTrip, passenger: passengerData });
    } else {
        const newTrip = new Trip({
            tripDate: adjustedTripDate,
            trips: [passengerData]
        });
        await newTrip.save();
        res.render('trips/confirmation', { trip: newTrip, passenger: passengerData });
    }
}));

// Route to handle all other undefined routes and return a 404 error
router.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error handling middleware
router.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

// Export the router
module.exports = router;