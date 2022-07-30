const mongoose = require('mongoose')
const Asset = require('../models/asset')
const seedAssets = require('./seedAssets')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/asset-tracker')
  console.log('Mongo Online')
}
main().catch((err) => console.log(err))

const seedDB = async () => {
  await Asset.deleteMany({})
  await Asset.insertMany(seedAssets)
}

seedDB().then(() => {
  console.log('done')
  mongoose.connection.close()
})
