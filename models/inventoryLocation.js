const mongoose = require('mongoose')

const { Schema } = mongoose

const AddressSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  address2: String,
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
})

const InventoryLocationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: AddressSchema,
    required: true,
    _id: false,
  },
  category: {
    type: String,
    enum: ['Vehicle', 'Employee', 'OfficeWarehouse', 'Jobsite'],
    required: true,
  },
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
})

module.exports = mongoose.model('InventoryLocation', InventoryLocationSchema)
