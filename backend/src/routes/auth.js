import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/register', async (req, res) => {
	try {
		const { email, password, role } = req.body
		const exists = await User.findOne({ email })
		if (exists) return res.status(400).json({ error: 'Email in use' })
		const passwordHash = await bcrypt.hash(password, 10)
		const user = await User.create({ email, passwordHash, role: role || 'admin' })
		res.json({ id: user._id, email: user.email, role: user.role })
	} catch (e) {
		res.status(500).json({ error: 'Failed to register' })
	}
})

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ error: 'Invalid credentials' })
		const ok = await bcrypt.compare(password, user.passwordHash)
		if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
		const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
		res.json({ token })
	} catch (e) {
		res.status(500).json({ error: 'Failed to login' })
	}
})

export default router


