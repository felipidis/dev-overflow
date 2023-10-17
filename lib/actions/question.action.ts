'use server'
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams
} from './shared.types.d'

import Answer from '@/database/answer.model'
import Interaction from '@/database/interaction.model'
import Question from '@/database/question.model'
import Tag from '@/database/tag.model'
import User from '@/database/user.model'
import { FilterQuery } from 'mongoose'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../mongoose'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase()

    const { searchQuery } = params

    const query: FilterQuery<typeof Question> = {}

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 })

    return questions
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase()

    const { questionId } = params

    const question = await Question.findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture'
      })

    return question
  } catch (error) {
    console.log(error)
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase()

    const { title, content, tags, author, path } = params

    const question = await Question.create({ title, content, author })

    const tagDocuments = await Promise.all(
      tags.map(async (tag) => {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: 'i' } },
          { $setOnInsert: { name: tag }, $push: { questions: question._id } },
          { upsert: true, new: true }
        )

        return existingTag._id
      })
    )

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } }
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()

    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true
    })

    if (!question) {
      throw new Error('Question not found')
    }

    // Increment author's reputation

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()

    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true
    })

    if (!question) {
      throw new Error('Question not found')
    }

    // Increment author's reputation

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase()

    const { questionId, path } = params

    await Question.findByIdAndDelete(questionId)
    await Answer.deleteMany({ question: questionId })
    await Interaction.deleteMany({ question: questionId })
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    )

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase()

    const { questionId, title, content, path } = params

    const question = await Question.findById(questionId).populate('tags')

    if (!question) {
      throw new Error('Question not found')
    }

    question.title = title
    question.content = content

    await question.save()

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getHotQuestions() {
  try {
    await connectToDatabase()

    const questions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5)

    return questions
  } catch (error) {
    console.log(error)
    throw error
  }
}
