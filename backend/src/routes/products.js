import { Router } from 'express'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public list (only published unless query all=true and authed)
router.get('/', async (req, res) => {
  const { tag, exclusivity, artist, all } = req.query
  const q = {}
  if (tag) q.tags = tag
  if (exclusivity) q.exclusivity = exclusivity
  if (artist) q.artist = artist
  if (!(all === 'true')) q.published = true
  const items = await Product.find(q).sort({ createdAt: -1 })
  res.json({ items, total: items.length })
})

// Public detail by slug (published only)
router.get('/:slug', async (req, res) => {
  const item = await Product.findOne({ slug: req.params.slug, published: true }).populate('artist')
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

// Create product (artist/admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.json(product)
  } catch (e) {
    res.status(400).json({ error: 'Failed to create' })
  }
})

// Update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(product)
  } catch (e) {
    res.status(400).json({ error: 'Failed to update' })
  }
})

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router


