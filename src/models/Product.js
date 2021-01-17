const Joi = require('joi')

module.exports = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string(),
    color: Joi.string(),
    department: Joi.string(),
    material: Joi.string(),
    imageUrl: Joi.string().uri().required()
})