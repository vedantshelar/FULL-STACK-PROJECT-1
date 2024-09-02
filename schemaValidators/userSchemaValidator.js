const Joi = require('joi');

const userSchemaValidator = Joi.object({
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
}) 
 
module.exports = userSchemaValidator;