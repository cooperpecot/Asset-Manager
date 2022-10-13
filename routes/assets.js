const express = require('express')

const router = express.Router()

const Asset = require('../models/asset')
const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')
const { assetSchema } = require('../schemas')

const assetCategories = ['Vehicle', 'Tool', 'Phone', 'Laptop/Tablet']

const validateAsset = (req, res, next) => {
  const { error } = assetSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

// Index
router.get('/', catchAsync(async (req, res) => {
  if (req.query.category) {
    const q = await Asset.find({ category: req.query.category }).populate('location')
    console.log(q)
    res.render('../views/assets/index', { q })
  } else {
    const q = null
    const phones = await Asset.find({ category: 'Phone' }).populate('location')
    const vehicles = await Asset.find({ category: 'Vehicle' }).populate('location')
    const tools = await Asset.find({ category: 'Tool' }).populate('location')
    const lapTab = await Asset.find({ category: 'LaptopTablet' }).populate('location')
    res.render('assets/index', { q, phones, vehicles, tools, lapTab })
  }
}))

// New
router.get('/new', (req, res) => {
  res.render('assets/new')
})

// Create
router.post('/', validateAsset, catchAsync(async (req, res) => {
  const a = new Asset(req.body.asset)
  await a.save()
  res.redirect('/assets')
}))

// Show
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const a = await Asset.findById(id).populate('location')
  res.render('assets/show', { a })
}))

// Edit
router.get('/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params
  const a = await Asset.findById(id)
  res.render('assets/edit', { a, assetCategories })
}))

// Update
router.patch('/:id', validateAsset, catchAsync(async (req, res) => {
  const { id } = req.params
  await Asset.findByIdAndUpdate(id, req.body.asset)
  res.redirect(`/assets/${id}`)
}))

// Destroy
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Asset.findByIdAndRemove(id)
  res.redirect('/assets')
}))

module.exports = router
