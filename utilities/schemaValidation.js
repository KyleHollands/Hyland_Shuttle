// Joi schema validation for trip object
const Joi = require('joi');

// Joi schema for trip object
module.exports.tripSchemaValidation = Joi.object({
    tripDate: Joi.date().required(),
    pickupLocation: Joi.string().required(),
    dropoffLocation: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email(),
    numberOfPassengers: Joi.number().required().min(1).max(6)
}).required();