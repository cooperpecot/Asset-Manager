const express = require('express')

const app = express()
const path = require('path')
const mongoose = require('mongoose')
const engine = require('ejs-mate')
const methodOverride = require('method-override')

const { assetSchema } = require('./schemas')
const catchAsync = require('./utilities/catchAsync')
const ExpressError = require('./utilities/ExpressError')
const Asset = require('./models/asset')

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

const categories = ['Vehicle', 'Tool', 'Phone', 'Laptop/Tablet']

app.get('/', (req, res) => {
  res.redirect('/assets')
})

// Index
app.get('/assets', catchAsync(async (req, res) => {
  const phones = await Asset.find({ category: 'Phone' })
  const vehicles = await Asset.find({ category: 'Vehicle' })
  const tools = await Asset.find({ category: 'Tool' })
  const lapTab = await Asset.find({ category: 'Laptop/Tablet' })
  res.render('assets/index', { phones, vehicles, tools, lapTab })
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
  res.render('assets/edit', { a, categories })
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

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err.message) err.message = 'Something went Wrong'
  res.status(status).render('err/error', { err })
})

app.listen(3000)
