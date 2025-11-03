import { Router } from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const router = Router()

// Complete a demo purchase instantly
router.post('/complete', requireAuth, async (req, res) => {
  try {
    const demo = (process.env.DEMO_MODE || '').toString().toLowerCase() === 'true'
    if (!demo) return res.status(400).json({ error: 'Demo mode disabled' })

    const { items = [] } = req.body
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' })

    const productIds = items.map(i => i.productId)
    const products = await Product.find({ _id: { $in: productIds }, published: true })
    const byId = new Map(products.map(p => [String(p._id), p]))

    let subtotal = 0
    const orderItems = []
    for (const i of items) {
      const p = byId.get(String(i.productId))
      if (!p) return res.status(400).json({ error: 'Invalid product' })
      subtotal += p.price?.amount || 0
      orderItems.push({ product: p._id, priceAtPurchase: { amount: p.price.amount, currency: p.price.currency || 'GHS' }, licenseType: i.licenseType || 'standard' })
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totals: { subtotal, fees: 0, currency: 'GHS', paid: true },
      payment: { provider: 'demo', ref: 'demo', status: 'paid' },
    })

    res.json({ ok: true, orderId: order._id })
  } catch (e) {
    res.status(400).json({ error: 'Failed to complete demo purchase' })
  }
})

export default router


