import { Router } from 'express'
import Submission from '../models/Submission.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Create submission (auth required)
router.post('/', requireAuth, async (req, res) => {
  try {
    const sub = await Submission.create({ ...req.body, user: req.user.id })
    res.json(sub)
  } catch (e) {
    res.status(400).json({ error: 'Failed to submit' })
  }
})

// My submissions
router.get('/me', requireAuth, async (req, res) => {
  const items = await Submission.find({ user: req.user.id }).sort({ createdAt: -1 })
  res.json({ items })
})

// Admin list and update (simple gate: role must be admin/editor)
router.get('/', requireAuth, async (req, res) => {
  if (!['admin', 'editor'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  const items = await Submission.find().sort({ createdAt: -1 })
  res.json({ items })
})

router.put('/:id', requireAuth, async (req, res) => {
  if (!['admin', 'editor'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  try {
    const sub = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(sub)
  } catch (e) {
    res.status(400).json({ error: 'Failed to update submission' })
  }
})

export default router


