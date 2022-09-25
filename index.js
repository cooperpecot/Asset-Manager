const express = require('express')

const app = express()
const path = require('path')
const mongoose = require('mongoose')
const engine = require('ejs-mate')
const methodOverride = require('method-override')

const { assetSchema } = require('./schemas')
const { inventoryLocationSchema } = require('./schemas')
const catchAsync = require('./utilities/catchAsync')
const ExpressError = require('./utilities/ExpressError')
const Asset = require('./models/asset')
const Location = require('./models/inventoryLocation')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/asset-tracker')
  console.log('Mongo Online')
}

main().catch((err) => console.log(err))

app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateAsset = (req, res, next) => {
  const { error } = assetSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const validateLocation = (req, res, next) => {
  const { error } = inventoryLocationSchema.validate(req.body.location)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const assetCategories = ['Vehicle', 'Tool', 'Phone', 'Laptop/Tablet']
const locationCategories = []

app.get('/', (req, res) => {
  res.redirect('/assets')
})
// ASSET ROUTES
// Index
app.get('/assets', catchAsync(async (req, res) => {
  if (req.query.category) {
    const q = await Asset.find({ category: req.query.category })
    res.render('assets/index', { q })
  } else {
    const q = null
    const phones = await Asset.find({ category: 'Phone' })
    const vehicles = await Asset.find({ category: 'Vehicle' })
    const tools = await Asset.find({ category: 'Tool' })
    const lapTab = await Asset.find({ category: 'LaptopTablet' })
    res.render('assets/index', { q, phones, vehicles, tools, lapTab })
  }
}))

// New
app.get('/assets/new', (req, res) => {
  res.render('assets/new')
})

// Create
app.post('/assets', validateAsset, catchAsync(async (req, res, next) => {
  const a = new Asset(req.body.asset)
  await a.save()
  res.redirect('/assets')
}))

// Show
app.get('/assets/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const a = await Asset.findById(id)
  res.render('assets/show', { a })
}))

// Edit
app.get('/assets/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params
  const a = await Asset.findById(id)
  res.render('assets/edit', { a, assetCategories })
}))

// Update
app.patch('/assets/:id', validateAsset, catchAsync(async (req, res) => {
  const { id } = req.params
  await Asset.findByIdAndUpdate(id, req.body.asset)
  res.redirect(`/assets/${id}`)
}))

// Destroy
app.delete('/assets/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Asset.findByIdAndRemove(id)
  res.redirect('/assets')
}))

// LOCATION ROUTES
// Index
app.get('/locations', catchAsync(async (req, res) => {
  if (req.query.category) {
    const q = await Location.find({ category: req.query.category })
    res.render('locations/index', { q })
  } else {
    const q = null
    const offices = await Location.find({ category: 'OfficeWarehouse' })
    const vehicles = await Location.find({ category: 'Vehicle' })
    const jobsites = await Location.find({ category: 'Jobsite' })
    const employees = await Location.find({ category: 'Employee' })
    // const locations = await Location.find({})
    res.render('locations/index', { q, offices, vehicles, jobsites, employees })
  }
}))

// New
app.get('/locations/new', (req, res) => {
  res.render('locations/new')
})

// Create
app.post('/locations', validateLocation, catchAsync(async (req, res) => {
  const l = new Location(req.body.location)
  l.address = req.body.address
  await l.save()
  res.redirect('/assets')
}))

// Show
app.get('/locations/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const l = await Location.findById(id)
  res.render('locations/show', { l })
}))

// Edit
app.get('/locaitons/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params
  const l = await Location.findById(id)
  res.render('locations/show', { l, locationCategories })
}))

// Update
app.patch('/locations/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Location.findByIdAndUpdate(id, req.body.location)
  res.redirect(`/locations/${id}`)
}))

// Destroy
app.delete('/assets/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Location.findByIdAndRemove(id)
  res.redirect('/locations')
}))

// ERROR ROUTES
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err.message) err.message = 'Something went Wrong'
  res.status(status).render('err/error', { err })
})

app.listen(3000)
