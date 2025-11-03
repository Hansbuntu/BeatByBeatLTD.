import { Router } from 'express'
import Order from '../models/Order.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Admin: all orders
router.get('/', requireAuth, async (req, res) => {
  if (!['admin', 'editor'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user')
  res.json({ items: orders })
})

// Current user's orders
router.get('/me', requireAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
  res.json({ items: orders })
})

// Get single (owner only)
router.get('/:id', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order || String(order.user) !== String(req.user.id)) return res.status(404).json({ error: 'Not found' })
  res.json(order)
})

// Create draft order (placeholder for checkout)
router.post('/', requireAuth, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id })
    res.json(order)
  } catch (e) {
    res.status(400).json({ error: 'Failed to create order' })
  }
})

export default router


