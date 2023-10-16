'use server'
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams
} from './shared.types.d'

import Answer from '@/database/answer.model'
import Interaction from '@/database/interaction.model'
import Question from '@/database/question.model'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../mongoose'

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase()

    const { author, content, path, question } = params

    const answer = await Answer.create({ content, author, question })

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id }
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase()

    const { questionId } = params

    const answers = await Answer.find({
      question: questionId
    })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture'
      })
      .sort({
        createdAt: -1
      })

    return answers
  } catch (error) {
    console.log(error)
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasUpVoted, hasDownVoted, path } = params

    let updateQuery = {}

    if (hasUpVoted) {
      updateQuery = { $pull: { upvotes: userId } }
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId }
      }
    } else {
      updateQuery = { $addToSet: { upvotes: userId } }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    })

    if (!answer) {
      throw new Error('Answer not found')
    }

    // Increment author's reputation

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasUpVoted, hasDownVoted, path } = params

    let updateQuery = {}

    if (hasDownVoted) {
      updateQuery = { $pull: { downvotes: userId } }
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId }
      }
    } else {
      updateQuery = { $addToSet: { downvotes: userId } }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    })

    if (!answer) {
      throw new Error('Answer not found')
    }

    // Increment author's reputation

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase()

    const { answerId, path } = params

    await Answer.findByIdAndDelete(answerId)
    await Question.updateMany(
      { answers: answerId },
      { $pull: { answers: answerId } }
    )
    await Interaction.deleteMany({ answer: answerId })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
