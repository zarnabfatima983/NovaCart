const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountedPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  color: { type: String },
  size: { type: String },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'United States' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'cod'],
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    shippingMethod: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard',
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
      default: 'processing',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `NC-${String(count + 1001).padStart(6, '0')}`;
    // Set estimated delivery
    const days = this.shippingMethod === 'express' ? 2 : 7;
    this.estimatedDelivery = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    // Initialize status history
    this.statusHistory = [{ status: 'processing', note: 'Order placed successfully' }];
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
