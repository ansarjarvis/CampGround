const BaseJoi = require("joi");
const { number } = require("joi")
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);

module.exports.campValidSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        price: joi.number().required().positive(),
        // image: joi.string().required(),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewValidSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required().escapeHTML()
    }).required()
})



