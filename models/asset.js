const mongoose = require('mongoose')

const { Schema } = mongoose

const AssetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Vehicle', 'Tool', 'Phone', 'LaptopTablet'],
    required: true,
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryLocation',
    default: '633cda2b7e8b14694297330f',
  },
  assetTag: Number,
  uniqueID: String,
})

module.exports = mongoose.model('Asset', AssetSchema)
