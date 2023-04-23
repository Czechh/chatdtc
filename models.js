import mongoose from 'mongoose'

const businessSchema = new mongoose.Schema({
  name: String,
  philosophy: String,
  thesis: String,
  marketingInsight: String,
})
export const Business = mongoose.model('Business', businessSchema)

// const productSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   description: String,
// })
// export const Product = mongoose.model('Product', productSchema)

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// })
// export const User = mongoose.model('User', userSchema)

const eventSchema = new mongoose.Schema({
  business: String,
  user: String,
  type: String,
  context: String,
})
export const Order = mongoose.model('Event', eventSchema)
