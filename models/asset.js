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
    required: true,
  },
  location: [{ type: Schema.Types.ObjectId, ref: 'InventoryLocation' }],
  assetTag: Number,
  uniqueID: String,
})

module.exports = mongoose.model('Asset', AssetSchema)
