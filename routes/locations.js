const express = require('express')

const router = express.Router()

const Location = require('../models/inventoryLocation')
const Asset = require('../models/asset')

const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')
const { inventoryLocationSchema } = require('../schemas')

const validateLocation = (req, res, next) => {
  const { error } = inventoryLocationSchema.validate(req.body.location)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const locationCategories = []

// LOCATION CRUD
// Index
router.get('/', catchAsync(async (req, res) => {
  if (req.query.category) {
    const q = await Location.find({ category: req.query.category })
    res.render('locations/index', { q })
  } else {
    const q = null
    const offices = await Location.find({ category: 'OfficeWarehouse' })
    const vehicles = await Location.find({ category: 'Vehicle' })
    const jobsites = await Location.find({ category: 'Jobsite' })
    const employees = await Location.find({ category: 'Employee' })
    res.render('locations/index', { q, offices, vehicles, jobsites, employees })
  }
}))

// New
router.get('/new', (req, res) => {
  res.render('../views/locations/new')
})

// Create
router.post('/', validateLocation, catchAsync(async (req, res) => {
  const l = new Location(req.body.location)
  l.address = req.body.address
  await l.save()
  res.redirect('/locations')
}))

// Show
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const l = await Location.findById(id).populate('assets')
  res.render('locations/show', { l })
}))

// Edit
router.get('/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params
  const l = await Location.findById(id)
  res.render('locations/show', { l, locationCategories })
}))

// Update
router.patch('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Location.findByIdAndUpdate(id, req.body.location)
  res.redirect(`/locations/${id}`)
}))

// Destroy
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Location.findByIdAndRemove(id)
  res.redirect('/locations')
}))

// LOCATION FUNCTIONS
// Asset Assignment
router.get('/:id/assets/assign', catchAsync(async (req, res) => {
  const { id } = req.params
  const l = await Location.findById(id)
  const assets = await Asset.find({})
  res.render('assets/assign', { assets, l, id })
}))

router.post('/:id/assets', catchAsync(async (req, res) => {
  const { id } = req.params
  const l = await Location.findById(id)
  const assets = await Asset.find({ _id: { $in: req.body.assets } })
  await assets.forEach((a) => {
    l.assets.push(a)
    a.location = l
    a.assigned = true
    a.save()
  })
  await l.save()

  res.redirect(`/locations/${id}`)
}))

module.exports = router
