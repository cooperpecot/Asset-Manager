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

module.exports.inventoryLocationSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.object({
    address: Joi.string().required(),
    address2: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().required(),
  }),
  category: Joi.string().required(),
})
