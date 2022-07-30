const mongoose = require('mongoose')

const { Schema } = mongoose

const AssetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Vehicle', 'Tool', 'Phone', 'Laptop/Tablet'],
    required: true,
  },
  assigned: {
    type: Boolean,
    default: false,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  assetTag: Number,
  uniqueID: String,
})

module.exports = mongoose.model('Asset', AssetSchema)
