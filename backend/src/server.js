import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import artistRoutes from './routes/artists.js'
import uploadRoutes from './routes/uploads.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import paystackRoutes from './routes/checkout.paystack.js'
import submissionRoutes from './routes/submissions.js'
import demoCheckoutRoutes from './routes/checkout.demo.js'
import adminSeedDemoRoutes from './routes/admin.seed.demo.js'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Allow localhost on any port in dev, or a specific origin via CORS_ORIGIN
const corsOrigin = (origin, callback) => {
	const envOrigin = process.env.CORS_ORIGIN
	if (!origin) return callback(null, true)
	if (envOrigin && origin === envOrigin) return callback(null, true)
	if (origin.startsWith('http://localhost:')) return callback(null, true)
	return callback(null, false)
}
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Static serving for uploaded files
const uploadsDir = path.resolve(process.cwd(), 'uploads')
// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req, res) => {
	res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/artists', artistRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/checkout/paystack', paystackRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/checkout/demo', demoCheckoutRoutes)
app.use('/api/admin', adminSeedDemoRoutes)

const PORT = process.env.PORT || 4000
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/beatsbybeatsltd'

async function start() {
	try {
		await mongoose.connect(DB_URI)
		console.log('MongoDB connected')
		app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
	} catch (err) {
		console.error('Failed to start server:', err)
		process.exit(1)
	}
}

start()


