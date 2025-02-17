// ====================
// Scripts for the website
// ====================

// Function to navigate to the selected trip
function navigateToTrip() {
    var dropdown = document.getElementById('datesDropdown');
    var selectedValue = dropdown.options[dropdown.selectedIndex].value;
    if (selectedValue) {
        window.location.href = selectedValue;
    }
}

// Locations for the trips
const locations = ['Haliburton', 'Allsaw', 'Minden', 'Miners Bay', 'Moore Falls', 'Norland', 'Coboconk', 'Rosedale', 'Fenelon Falls', 'Cameron', 'Lindsay', 'Hwy. 35 & 7A', 'Hwy 2 @ Hwy 35/115 Park & Ride', 'Bowmanville', 'Courtice', 'Oshawa', 'Scarborough', 'Toronto'];

// Function to adjust the trip date to the correct timezone
const adjustTripDate = (tripDate) => {
    let adjustedTripDate = new Date(tripDate);
    adjustedTripDate.setMinutes(adjustedTripDate.getMinutes() + adjustedTripDate.getTimezoneOffset());
    return adjustedTripDate;
};

// Function to determine the direction of the trip
const determineDirection = (pickupLocation, dropoffLocation) => {
    const pickupIndex = locations.indexOf(pickupLocation);
    const dropoffIndex = locations.indexOf(dropoffLocation);

    if (pickupIndex < dropoffIndex) {
        return 'Southbound';
    } else if (pickupIndex > dropoffIndex) {
        return 'Northbound';
    } else {
        return 'Unknown';
    }
};

// ====================
// Export the helper functions
// ====================
module.exports = {
    adjustTripDate,
    determineDirection
};
