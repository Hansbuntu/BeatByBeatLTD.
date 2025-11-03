import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['admin', 'editor', 'artist', 'customer'], default: 'editor' },
        artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    },
    { timestamps: true }
)

export default mongoose.model('User', userSchema)


