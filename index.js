import express from 'express'
import mongoose from 'mongoose'
import BusinessController from './controllers/business.js'
import * as Models from './models.js'
import * as openai from 'openai.js'

mongoose.connect(process.env.DATABASE_URL)

const app = express()
app.use(express.json())

app.get('/', (_req, res) => res.send({ now: Date.now() }))
app.post('/businesses', (req, res) => BusinessController.create(req, res))
app.get('/businesses/:id', (req, res) => BusinessController.getOne(req, res))

app.post('/product', async (req, res) => {
  const { name, price } = req.body
  const product = await Models.Product.create({ name, price, quantity: 0 })

  return res.send({ data: product })
})

app.get('/products', async (req, res) => {
  const products = await Models.Product.find().exec()
  return res.send({ data: products })
})

app.get('/products/:id', async (req, res) => {
  const product = await Models.Product.findOne({ _id: req.params.id }).exec()
  if (!product) return res.status(404).send({ error: 'Product not found' })

  return res.send({ data: product })
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
