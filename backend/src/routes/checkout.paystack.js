import { Router } from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET || ''
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const DEMO_MODE = (process.env.DEMO_MODE || '').toString().toLowerCase() === 'true'

const router = Router()

// Initialize a Paystack transaction for Ghana (GHS, Mobile Money + card)
router.post('/init', requireAuth, async (req, res) => {
  try {
    const { items = [] } = req.body
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' })

    // Fetch products and compute totals
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

    const currency = 'GHS'
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totals: { subtotal, fees: 0, currency, paid: false },
      payment: { provider: 'paystack', status: 'pending' },
    })

    // DEMO fast-path OR when no secret provided: pretend checkout and bounce back to frontend
    if (DEMO_MODE || !PAYSTACK_SECRET) {
      const authorization_url = `${FRONTEND_URL}/checkout?orderId=${order._id}&reference=demo`
      return res.json({ authorization_url, reference: 'demo', orderId: order._id })
    }

    const callback = `${FRONTEND_URL}/checkout?orderId=${order._id}`
    const initBody = {
      email: req.user.email,
      amount: Math.round(subtotal * 100), // pesewas
      currency,
      callback_url: callback,
      metadata: { orderId: String(order._id) },
    }

    const r = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PAYSTACK_SECRET}` },
      body: JSON.stringify(initBody),
    })

    const data = await r.json()
    if (!data.status) {
      return res.status(400).json({ error: data.message || 'Failed to init payment' })
    }
    const { authorization_url, reference } = data.data
    return res.json({ authorization_url, reference, orderId: order._id })
  } catch (e) {
    res.status(400).json({ error: 'Failed to initialize' })
  }
})

// Verify a Paystack transaction reference and mark order as paid
router.post('/verify', requireAuth, async (req, res) => {
  try {
    const { reference, orderId } = req.body
    if (!reference || !orderId) return res.status(400).json({ error: 'Missing reference/orderId' })
    // In demo mode or demo reference, skip remote verification and mark paid
    if (DEMO_MODE || reference === 'demo') {
      const order = await Order.findById(orderId)
      if (!order || String(order.user) !== String(req.user.id)) return res.status(404).json({ error: 'Order not found' })
      order.payment = { provider: 'paystack', ref: reference, status: 'paid' }
      order.totals.paid = true
      await order.save()
      return res.json({ ok: true })
    }

    const r = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    })
    const data = await r.json()
    if (!data.status) return res.status(400).json({ error: 'Verification failed' })
    const st = data.data.status
    if (st !== 'success') return res.status(400).json({ error: 'Payment not successful' })

    const order = await Order.findById(orderId)
    if (!order || String(order.user) !== String(req.user.id)) return res.status(404).json({ error: 'Order not found' })

    order.payment = { provider: 'paystack', ref: reference, status: 'paid' }
    order.totals.paid = true
    await order.save()

    return res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: 'Failed to verify' })
  }
})

export default router


