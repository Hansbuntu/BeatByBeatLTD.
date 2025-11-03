import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Artist from './models/Artist.js'
import Post from './models/Post.js'

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') })

const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/beatsbybeatsltd'

async function run() {
	await mongoose.connect(DB_URI)
	console.log('Connected to DB, seeding...')

	await Promise.all([User.deleteMany({}), Artist.deleteMany({}), Post.deleteMany({})])

	const admin = await User.create({
		email: 'admin@example.com',
		passwordHash: await bcrypt.hash('pass123', 10),
		role: 'admin',
	})

	const artists = await Artist.insertMany([
		{ name: 'BBBLTD Collective', slug: 'bbb-collective', bio: 'Collective bio...', socials: { instagram: 'bbb.collective' } },
		{ name: 'DJ Waves', slug: 'dj-waves', bio: 'Producer/DJ focusing on deep house.', socials: { instagram: 'djwaves' } },
	])

	const audio = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

	await Post.insertMany([
		{
			title: 'Welcome to beatsbybeatsltd',
			slug: 'welcome-to-bbbs',
			excerpt: 'Kickoff post for the label blog.',
			contentMd: '# Hello!\n\nThis is our first post with **Markdown**.',
			tags: ['news'],
			artist: artists[0]._id,
			coverImageUrl: '',
		},
		{
			title: 'New Single: Deep Waves',
			slug: 'new-single-deep-waves',
			excerpt: 'Out now: Deep Waves.',
			contentMd: 'Listen to our new single and enjoy the vibes.',
			tags: ['release', 'house'],
			artist: artists[1]._id,
			audioUrl: audio,
			coverImageUrl: '',
		},
		{
			title: 'Behind the Scenes',
			slug: 'behind-the-scenes',
			excerpt: 'How we craft our sound.',
			contentMd: 'We will share snippets and more soon.',
			tags: ['studio'],
			artist: artists[0]._id,
		},
	])

	console.log('Seed complete. Admin login: admin@example.com / pass123')
	await mongoose.disconnect()
}

run().catch((e) => {
	console.error(e)
	process.exit(1)
})


