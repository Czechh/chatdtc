import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({ name: String, identity: String, description: String });
export const Business = mongoose.model('Business', businessSchema);

const productSchema = new mongoose.Schema({ name: String, price: Number, description: String });
export const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({ name: String, email: String, password: String });
export const User = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({ user: String, products: [productSchema], total: Number });
export const Order = mongoose.model('Order', orderSchema);
