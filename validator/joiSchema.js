const joi = require("joi");
const { number } = require("joi")

module.exports.campValidSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().positive(),
        image: joi.string().required(),
        description: joi.string().required()
    }).required()
})

module.exports.reviewValidSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required()
    }).required()
})



