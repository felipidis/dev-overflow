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

    const updatedQuestion = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id }
    })

    await Interaction.create({
      user: author,
      action: 'answer',
      question,
      answer: answer._id,
      tags: updatedQuestion.tags
    })

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 }
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase()

    const { questionId, sortBy, page = 1, pageSize = 10 } = params

    const skip = (page - 1) * pageSize

    let sortedOptions = {}

    switch (sortBy) {
      case 'highestUpvotes':
        sortedOptions = { upvotes: -1 }
        break
      case 'lowestUpvotes':
        sortedOptions = { upvotes: 1 }
        break
      case 'recent':
        sortedOptions = { createdAt: -1 }
        break
      case 'old':
        sortedOptions = { createdAt: 1 }
        break
    }

    const answers = await Answer.find({
      question: questionId
    })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture'
      })
      .sort(sortedOptions)
      .skip(skip)
      .limit(pageSize)

    const totalAnswers = await Answer.countDocuments({
      question: questionId
    })

    const isNext = totalAnswers > skip + pageSize

    return { answers, isNext }
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

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpVoted ? -1 : 1 }
    })

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpVoted ? -10 : 10 }
    })

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

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownVoted ? -1 : 1 }
    })

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownVoted ? 10 : -10 }
    })

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
