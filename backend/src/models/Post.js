import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		excerpt: { type: String },
		contentMd: { type: String, required: true },
		tags: [{ type: String }],
		artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
		audioUrl: { type: String },
		coverImageUrl: { type: String },
		externalLink: { type: String },
		externalPlatform: { type: String, enum: ['youtube', 'soundcloud', 'spotify', 'other'], default: 'other' },
		featured: { type: Boolean, default: false },
		order: { type: Number, default: 0 },
		publishedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
)

export default mongoose.model('Post', postSchema)


