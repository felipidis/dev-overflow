'use server'

import Question from '@/database/question.model'
import Tag, { TTag } from '@/database/tag.model'
import User from '@/database/user.model'
import { FilterQuery } from 'mongoose'
import { connectToDatabase } from '../mongoose'
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams
} from './shared.types'

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase()

    const { userId } = params

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')

    // TODO: remove this mock later
    return [
      { _id: '1', name: 'tag' },
      { _id: '2', name: 'tag2' }
    ]
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()

    const { searchQuery, filter } = params

    const query: FilterQuery<typeof Tag> = {}

    if (searchQuery) {
      query.$or = [{ name: { $regex: searchQuery, $options: 'i' } }]
    }

    let sortOptions = {}

    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 }
        break
      case 'recent':
        sortOptions = { createdAt: -1 }
        break
      case 'name':
        sortOptions = { name: 1 }
        break
      case 'old':
        sortOptions = { createdAt: 1 }
        break
      default:
        break
    }

    const tags = await Tag.find(query).sort(sortOptions)

    return tags
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase()

    const { tagId, searchQuery } = params

    const tagFilter: FilterQuery<TTag> = { _id: tagId }

    const query: FilterQuery<typeof Question> = {}

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    })

    if (!tag) {
      throw new Error('Tag not found')
    }

    const questions = tag.questions

    return { tagTitle: tag.name, questions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getTopPopularTags() {
  try {
    await connectToDatabase()

    const tags = await Tag.aggregate([
      { $project: { name: 1, totalQuestions: { $size: '$questions' } } },
      { $sort: { totalQuestions: -1 } },
      { $limit: 5 }
    ])

    return tags
  } catch (error) {
    console.log(error)
    throw error
  }
}
