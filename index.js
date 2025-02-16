const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Trip = require('./models/trip'); // Import the Trip model

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
// Routes
// ====================

// Render the trips index page
app.get('/trips/', (req, res) => {
    res.render('trips/index');
});

// Render the page with all trip dates
app.get('/trips/allDates', async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/allDates', { trips });
});

// Render the page to create a new trip
app.get('/trips/new', (req, res) => {
    res.render('trips/new');
});

// Render the page to lookup a specific passenger trip by ID
app.post('/trips/lookup', async (req, res) => {
    const { tripId } = req.body;
    const trip = await Trip.findOne({ 'trips._id': tripId });
    if (trip) {
        console.log(tripId); // Log the passenger trip ID
        console.log(trip._id); // Log the parent trip ID
        console.log(trip); // Log the trip object
        res.render('trips/confirmation', { trip, passenger: trip.trips.id(tripId) });
    } else {
        res.status(404).send('Booking ID not found!');
    }
});

app.get('/trips/lookup', (req, res) => {
    res.render('trips/lookup');
});

// Render the details of a specific trip by ID
app.get('/trips/:id', async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    console.log(id);
    console.log(trip);
    res.render('trips/dateDetails', { trip });
});

// List of locations for determining trip direction
const locations = ['Haliburton', 'Allsaw', 'Minden', 'Miners Bay', 'Moore Falls', 'Norland', 'Coboconk', 'Rosedale', 'Fenelon Falls', 'Cameron', 'Lindsay', 'Hwy. 35 & 7A', 'Hwy 2 @ Hwy 35/115 Park & Ride', 'Bowmanville', 'Courtice', 'Oshawa', 'Scarborough', 'Toronto'];

// Handle form submission to create or update a trip
app.post('/trips/allDates', async (req, res) => {
    let { tripDate, pickupLocation, dropoffLocation, ...otherData } = req.body;

    // Adjust the tripDate to the correct timezone (e.g., UTC-5 for EST)
    let adjustedTripDate = new Date(tripDate);
    adjustedTripDate.setMinutes(adjustedTripDate.getMinutes() + adjustedTripDate.getTimezoneOffset());

    // Determine the direction based on pickup and dropoff locations
    const pickupIndex = locations.indexOf(pickupLocation);
    const dropoffIndex = locations.indexOf(dropoffLocation);

    let direction = 'Unknown';
    if (pickupIndex < dropoffIndex) {
        direction = 'Southbound';
    } else if (pickupIndex > dropoffIndex) {
        direction = 'Northbound';
    }

    // Create the passenger data object
    const passengerData = {
        _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
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
});

// ====================
// Server Configuration
// ====================
app.listen(3000, () => {
    console.log('Listening on port 3000'); // Log message when server starts
});
