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
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()

    const tags = await Tag.find({})

    return tags
  } catch (error) {
    console.log(error)
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase()

    const { tagId, searchQuery } = params

    const tagFilter: FilterQuery<TTag> = { _id: tagId }

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
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
  }
}
