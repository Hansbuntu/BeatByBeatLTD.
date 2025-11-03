import mongoose from 'mongoose'

const priceSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['GHS', 'USD'], default: 'GHS' },
  },
  { _id: false }
)

const revenueSplitSchema = new mongoose.Schema(
  {
    labelSharePct: { type: Number, default: 50 },
    artistSharePct: { type: Number, default: 50 },
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    coverImageUrl: { type: String },
    audioPreviewUrl: { type: String },
    price: { type: priceSchema, required: true },
    exclusivity: { type: String, enum: ['exclusive', 'limited', 'open'], default: 'exclusive' },
    inventoryCount: { type: Number, default: null },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    revenueSplit: { type: revenueSplitSchema, default: { labelSharePct: 50, artistSharePct: 50 } },
    published: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)


