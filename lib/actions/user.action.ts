'use server'

import Answer from '@/database/answer.model'
import Question from '@/database/question.model'
import Tag from '@/database/tag.model'
import User from '@/database/user.model'
import { BadgeCriteriaType } from '@/types'
import { FilterQuery } from 'mongoose'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../mongoose'
import { assignBadges } from '../utils'
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams
} from './shared.types'

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase()

    const { userId } = params

    const user = await User.findOne({ clerkId: userId })

    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase()

    const { searchQuery, filter, page = 1, pageSize = 10 } = params

    const skip = (page - 1) * pageSize

    const query: FilterQuery<typeof User> = {}

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    let sortOptions = {}

    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: -1 }
        break
      case 'old_users':
        sortOptions = { joinedAt: 1 }
        break
      case 'top_users':
        sortOptions = { reputation: -1 }
        break
      default:
        break
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)

    const totalUsers = await User.countDocuments(query)

    const isNext = totalUsers > skip + pageSize

    return { users, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase()

    const newUser = await User.create(userData)

    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase()

    const { clerkId, updateData, path } = params

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase()

    const { clerkId } = params

    const user = await User.findOneAndDelete({ clerkId })

    if (!user) {
      throw new Error('User not found')
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id })

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id)

    return deletedUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase()

    const { userId, questionId, path } = params

    const user = await User.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const isQuestionSaved = user.saved.includes(questionId)

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      )
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase()

    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params

    const skip = (page - 1) * pageSize

    const query: FilterQuery<typeof Question> = {}

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    let sortOptions = {}

    switch (filter) {
      case 'most_recent':
        sortOptions = { createdAt: -1 }
        break
      case 'oldest':
        sortOptions = { createdAt: 1 }
        break
      case 'most_voted':
        sortOptions = { upvotes: -1 }
        break
      case 'most_viewed':
        sortOptions = { views: -1 }
        break
      case 'most_answered':
        sortOptions = { answers: -1 }
        break
      default:
        break
    }

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip,
        limit: pageSize
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    })

    if (!user) {
      throw new Error('User not found')
    }

    const totalQuestions = await User.aggregate([
      { $match: { _id: user._id } },
      { $project: { total: { $size: '$saved' } } }
    ])

    const isNext = totalQuestions[0].total > skip + pageSize

    const savedQuestions = user.saved

    return { savedQuestions, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase()

    const { userId } = params

    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      throw new Error('User not found')
    }

    const totalQuestions = await Question.countDocuments({ author: user._id })
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    const [questionUpVotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { upvotes: { $size: '$upvotes' } } },
      { $group: { _id: null, total: { $sum: '$upvotes' } } }
    ])

    const [answerUpVotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { upvotes: { $size: '$upvotes' } } },
      { $group: { _id: null, total: { $sum: '$upvotes' } } }
    ])

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ])

    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      {
        type: 'QUESTION_UPVOTES' as BadgeCriteriaType,
        count: questionUpVotes?.total ?? 0
      },
      {
        type: 'ANSWER_UPVOTES' as BadgeCriteriaType,
        count: answerUpVotes?.total ?? 0
      },
      {
        type: 'TOTAL_VIEWS' as BadgeCriteriaType,
        count: questionViews?.total ?? 0
      }
    ]

    const badgeCounts = assignBadges({ criteria })

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const skip = (page - 1) * pageSize

    const questions = await Question.find({
      author: userId
    })
      .populate({
        path: 'tags',
        model: Tag,
        select: '_id name'
      })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture'
      })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skip)
      .limit(pageSize)

    const totalQuestions = await Question.countDocuments({
      author: userId
    })

    const isNext = totalQuestions > skip + pageSize

    return {
      questions,
      isNext
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const skip = (page - 1) * pageSize

    const answers = await Answer.find({ author: userId })
      .populate('question', '_id title')
      .populate('author', '_id clerkId name picture')
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(pageSize)

    const totalAnswers = await Answer.countDocuments({ author: userId })

    const isNext = totalAnswers > skip + pageSize

    return {
      answers,
      isNext
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
