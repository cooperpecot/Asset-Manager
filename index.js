const express = require('express')

const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Asset = require('./models/asset')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/asset-tracker')
  console.log('Mongo Online')
}

main().catch((err) => console.log(err))

app.listen(3000)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const categories = ['Vehicle', 'Tool', 'Phone', 'Laptop/Tablet']

app.get('/', (req, res) => {
  res.render('home')
})

// Index
app.get('/assets', async (req, res) => {
  const assets = await Asset.find({})
  res.render('assets/index', { assets })
})

// New
app.get('/assets/new', (req, res) => {
  res.render('assets/new')
})

// Create
app.post('/assets', async (req, res) => {
  const a = new Asset(req.body.asset)
  a.save()
  res.redirect('/assets')
})

// Show
app.get('/assets/:id', async (req, res) => {
  const { id } = req.params
  const a = await Asset.findById(id)
  res.render('assets/show', { a })
})

// Edit
app.get('/assets/:id/edit', async (req, res) => {
  const { id } = req.params
  const a = await Asset.findById(id)
  res.render('assets/edit', { a, categories })
})

// Update
app.patch('/assets/:id', async (req, res) => {
  const { id } = req.params
  await Asset.findByIdAndUpdate(id, req.body.asset)
  res.redirect(`/assets/${id}`)
})

// Destroy
app.delete('/assets/:id', async (req, res) => {
  const { id } = req.params
  await Asset.findByIdAndRemove(id)
  res.redirect('/assets')
})
