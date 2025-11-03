import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { requireAuth } from '../middleware/auth.js'
import Post from '../models/Post.js'
import Product from '../models/Product.js'

const router = Router()

const storage = multer.diskStorage({
	destination: function (_req, file, cb) {
		const dest = path.resolve(process.cwd(), 'uploads')
		// Ensure directory exists
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true })
		}
		cb(null, dest)
	},
	filename: function (_req, file, cb) {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const ext = path.extname(file.originalname)
		cb(null, unique + ext)
	},
})

function fileFilter(_req, file, cb) {
	const allowed = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/aac', 'image/jpeg', 'image/png', 'image/webp']
	if (allowed.includes(file.mimetype)) cb(null, true)
	else cb(new Error('Invalid file type'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } })

router.post('/', requireAuth, (req, res, next) => {
	upload.single('file')(req, res, (err) => {
		if (err) {
			if (err instanceof multer.MulterError) {
				return res.status(400).json({ error: err.message })
			}
			return res.status(400).json({ error: err.message })
		}
		next()
	})
}, (req, res) => {
	const file = req.file
	if (!file) return res.status(400).json({ error: 'No file uploaded' })
	const url = `/uploads/${file.filename}`
	res.json({ url, filename: file.originalname, size: file.size, mimetype: file.mimetype })
})

// Delete upload file (only if not referenced)
router.delete('/:filename', requireAuth, async (req, res) => {
	try {
		const filename = req.params.filename
		const fileUrl = `/uploads/${filename}`
		
		// Check if referenced in Posts
		const postWithImage = await Post.findOne({ coverImageUrl: fileUrl })
		const postWithAudio = await Post.findOne({ audioUrl: fileUrl })
		
		// Check if referenced in Products
		const productWithImage = await Product.findOne({ coverImageUrl: fileUrl })
		const productWithAudio = await Product.findOne({ audioPreviewUrl: fileUrl })
		
		if (postWithImage || postWithAudio || productWithImage || productWithAudio) {
			return res.status(400).json({ error: 'File is still referenced and cannot be deleted' })
		}
		
		// Delete file from disk
		const filePath = path.resolve(process.cwd(), 'uploads', filename)
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath)
			return res.json({ ok: true })
		}
		
		return res.status(404).json({ error: 'File not found' })
	} catch (e) {
		res.status(400).json({ error: 'Failed to delete file' })
	}
})

export default router


