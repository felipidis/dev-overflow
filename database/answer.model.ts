import { Schema, model, models } from 'mongoose'

export type TAnswer = {
  author: Schema.Types.ObjectId
  question: Schema.Types.ObjectId
  content: string
  upvotes: Schema.Types.ObjectId[]
  downvotes: Schema.Types.ObjectId[]
  createdAt: Date
}

const AnswerSchema = new Schema<TAnswer>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Answer = models.Answer || model<TAnswer>('Answer', AnswerSchema)

export default Answer
