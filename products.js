// app.post('/product', async (req, res) => {
//   const { name, price } = req.body
//   const product = await Models.Product.create({ name, price, quantity: 0 })

//   return res.send({ data: product })
// })

// app.get('/products', async (req, res) => {
//   const products = await Models.Product.find().exec()
//   return res.send({ data: products })
// })

// app.get('/products/:id', async (req, res) => {
//   const product = await Models.Product.findOne({ _id: req.params.id }).exec()
//   if (!product) return res.status(404).send({ error: 'Product not found' })

//   return res.send({ data: product })
// })
