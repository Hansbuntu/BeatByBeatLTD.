import mongoose from 'mongoose'

const artistSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		bio: { type: String },
		socials: {
			instagram: String,
			x: String,
			youtube: String,
			website: String,
		},
		avatarUrl: { type: String },
	},
	{ timestamps: true }
)

export default mongoose.model('Artist', artistSchema)


