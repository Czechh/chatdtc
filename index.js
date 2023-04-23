import express from 'express'
import mongoose from 'mongoose'
import BusinessController from './controllers/business.js'
import * as Models from './models.js'
import * as Replicate from './stable.js'
import * as openai from './openai.js'
import iterateProduct from './product_iteration.js'

mongoose.connect(process.env.DATABASE_URL)
const EVENT_TRIGGER = 3
const app = express()
app.use(express.json())
app.use(function (_req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.get('/', (_req, res) => res.send({ now: Date.now() }))
app.post('/businesses', (req, res) => BusinessController.create(req, res))
app.get('/businesses/:id', (req, res) => BusinessController.getOne(req, res))

app.post('/replicate-prompt', async (req, res) => {
  const result = await Replicate.prompt(req.body.prompt)
  return res.send(result)
})

app.post('/purchase', async (req, res) => {
  const { context, business } = req.body
  const event = await Models.Event.create({ context, business, type: 'purchase' })
  const eventCount = await Models.Event.countDocuments({ business }).exec()

  if (eventCount % EVENT_TRIGGER === 0) {
    // trigger mutation
    console.log('mutation triggered')
    const businessDb = await Models.Business.findOne({ _id: business }).exec()
    const events = await Models.Event.find({ business }).sort({ _id: -1 }).limit(3).exec()
    await iterateProduct(businessDb, events)
  }

  return res.send({ data: event })
})

app.post('/feedback', async (req, res) => {
  const { context, business } = req.body
  const event = await Models.Event.create({ context, business, type: 'feedback' })
  const eventCount = await Models.Event.countDocuments({ business }).exec()

  if (eventCount % EVENT_TRIGGER === 0) {
    console.log('mutation triggered')
    const businessDb = await Models.Business.findOne({ _id: business }).exec()
    const events = await Models.Event.find({ business }).sort({ _id: -1 }).limit(3).exec()
    await iterateProduct(businessDb, events)
  }

  return res.send({ data: event })
})

app.post('/prompt-text', async (req, res) => {
  const result = await openai.prompt(req.body.prompt)
  res.send(result)
})
app.post('/prompt-image', async (req, res) => {
  const result = await openai.promptImage(req.body.prompt)
  res.send(result)
})

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))
