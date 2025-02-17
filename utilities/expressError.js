// Define the ExpressError class to handle errors in the application
class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); // Call the super class constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

// Export the ExpressError class
module.exports = ExpressError;