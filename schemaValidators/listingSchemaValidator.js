const Listing = require('../models/Listing');
const Joi = require('joi');

const listingSchemaValidator = Joi.object({
    propertyArea: Joi.string().required(),
    description: Joi.string().min(3).required(),
    listingImages: Joi.array().items(Joi.object({ filename: Joi.string(), link: Joi.string() })),
    price: Joi.number().min(1).required(),
    country: Joi.string().required(),
    location: Joi.string().required(), 
    owner: Joi.required(),
    reviews: Joi.array(),
    city: Joi.string().required(),
    category: Joi.string().required()
})

module.exports = listingSchemaValidator; 