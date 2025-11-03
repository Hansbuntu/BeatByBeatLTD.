import { Router } from 'express'
import Post from '../models/Post.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
	const { page = 1, limit = 10, tag, featured } = req.query
	const q = tag ? { tags: tag } : {}
	if (featured === 'true') q.featured = true
	const items = await Post.find(q).sort({ order: 1, publishedAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
	const total = await Post.countDocuments(q)
	res.json({ items, total })
})

router.get('/:slug', async (req, res) => {
	const post = await Post.findOne({ slug: req.params.slug }).populate('artist')
	if (!post) return res.status(404).json({ error: 'Not found' })
	res.json(post)
})

router.post('/', requireAuth, async (req, res) => {
	try {
		const post = await Post.create(req.body)
		res.json(post)
	} catch (e) {
		res.status(400).json({ error: 'Failed to create' })
	}
})

router.put('/:id', requireAuth, async (req, res) => {
	try {
		const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
		res.json(post)
	} catch (e) {
		res.status(400).json({ error: 'Failed to update' })
	}
})

router.delete('/:id', requireAuth, async (req, res) => {
	await Post.findByIdAndDelete(req.params.id)
	res.json({ ok: true })
})

router.post('/reorder', requireAuth, async (req, res) => {
	try {
		const { updates } = req.body
		for (const { id, order } of updates) {
			await Post.findByIdAndUpdate(id, { order })
		}
		res.json({ ok: true })
	} catch (e) {
		res.status(400).json({ error: 'Failed to reorder' })
	}
})

router.post('/extract-metadata', requireAuth, async (req, res) => {
	try {
		const { url } = req.body
		if (!url || typeof url !== 'string') return res.status(400).json({ error: 'Missing url' })

		const lower = url.toLowerCase()
		let platform = 'other'
		if (lower.includes('youtube.com') || lower.includes('youtu.be')) platform = 'youtube'
		else if (lower.includes('soundcloud.com')) platform = 'soundcloud'
		else if (lower.includes('spotify.com')) platform = 'spotify'

		// Basic oEmbed endpoints
		const oembedMap = {
			youtube: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
			soundcloud: `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`,
			spotify: `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
		}

		let thumbnailUrl = ''
		if (platform in oembedMap) {
			try {
				const r = await fetch(oembedMap[platform])
				if (r.ok) {
					const data = await r.json()
					thumbnailUrl = data.thumbnail_url || ''
				}
			} catch {}
		}

		// If direct audio link (mp3/m4a/ogg), set as audioUrl
		let audioUrl = ''
		if (/\.(mp3|m4a|ogg|wav)(\?.*)?$/i.test(url)) {
			audioUrl = url
		}

		return res.json({ platform, thumbnailUrl, audioUrl })
	} catch (e) {
		res.status(400).json({ error: 'Failed to extract metadata' })
	}
})

export default router


