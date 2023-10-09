import { Document, Schema, model, models } from 'mongoose'

export type TTag = Document & {
  name: string
  description: string
  questions: Schema.Types.ObjectId[]
  followers: Schema.Types.ObjectId[]
  createdAt: Date
}

const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
})

const Tag = models.Tag || model('Tag', TagSchema)

export default Tag