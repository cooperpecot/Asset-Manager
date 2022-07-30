const mongoose = require('mongoose')

const { Schema } = mongoose

const InventoryLocationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Vehicle', 'Employee', 'Office', 'Jobsite'],
  },
})

// AssetSchema.methods.checkOut = function (from, to) {
//   this.location.push(to)
//   this.assigned = true
//   return this.save()
// }

module.exports = mongoose.model('InventoryLocation', InventoryLocationSchema)
