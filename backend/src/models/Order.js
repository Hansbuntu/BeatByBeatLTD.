import mongoose from 'mongoose'

const moneySchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['GHS', 'USD'], default: 'GHS' },
  },
  { _id: false }
)

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    priceAtPurchase: { type: moneySchema, required: true },
    licenseType: { type: String, default: 'standard' },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totals: {
      subtotal: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
      currency: { type: String, enum: ['GHS', 'USD'], default: 'GHS' },
      paid: { type: Boolean, default: false },
    },
    payment: {
      provider: { type: String, enum: ['paystack', 'flutterwave', 'stripe', 'none'], default: 'none' },
      ref: { type: String },
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    },
    downloadLinks: [
      {
        url: String,
        expiresAt: Date,
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)


