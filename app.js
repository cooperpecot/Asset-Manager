const express = require('express')

const app = express()
const path = require('path')
const mongoose = require('mongoose')
const engine = require('ejs-mate')
const methodOverride = require('method-override')
const assetRoutes = require('./routes/assets')
const locationRoutes = require('./routes/locations')

const ExpressError = require('./utilities/ExpressError')

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

app.use('/assets', assetRoutes)
app.use('/locations', locationRoutes)

// ERROR OUTES
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err.message) err.message = 'Something Went Wrong'
  res.status(status).render('err/error', { err })
})

app.listen(3000)
