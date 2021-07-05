const joi = require("joi");

const validSchema = joi.object({
    campground:joi.object({
        title:joi.string().required(),
        location:joi.string().required(),
        price:joi.number().min(1).required(),
        image:joi.string().required(),
        description:joi.string().required()
    }).required()
})

module.exports= validSchema;