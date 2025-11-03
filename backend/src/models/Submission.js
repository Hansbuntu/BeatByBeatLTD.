import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    links: [{ type: String }],
    notes: { type: String },
    status: { type: String, enum: ['received', 'in_review', 'approved', 'rejected'], default: 'received' },
  },
  { timestamps: true }
)

export default mongoose.model('Submission', submissionSchema)


