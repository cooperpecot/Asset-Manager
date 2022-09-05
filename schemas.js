const Joi = require('joi')

module.exports.assetSchema = Joi.object({
  asset: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    assigned: Joi.boolean().required(),
    location: Joi.string().required(),
    assetTag: Joi.number().greater(0).required(),
    uniqueID: Joi.string().required(),
  }).required(),
})
