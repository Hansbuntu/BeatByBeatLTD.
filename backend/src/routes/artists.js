import { Router } from 'express'
import Artist from '../models/Artist.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req, res) => {
	const items = await Artist.find().sort({ name: 1 })
	res.json(items)
})

router.get('/:slug', async (req, res) => {
	const item = await Artist.findOne({ slug: req.params.slug })
	if (!item) return res.status(404).json({ error: 'Not found' })
	res.json(item)
})

router.post('/', requireAuth, async (req, res) => {
	try {
		const item = await Artist.create(req.body)
		res.json(item)
	} catch (e) {
		res.status(400).json({ error: 'Failed to create' })
	}
})

router.put('/:id', requireAuth, async (req, res) => {
	try {
		const item = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true })
		res.json(item)
	} catch (e) {
		res.status(400).json({ error: 'Failed to update' })
	}
})

router.delete('/:id', requireAuth, async (req, res) => {
	await Artist.findByIdAndDelete(req.params.id)
	res.json({ ok: true })
})

export default router


