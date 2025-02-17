// ====================
// 
// ====================

class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // Call the super class constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError; // Export the ExpressError class