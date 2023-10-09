'use server'
import { CreateQuestionParams, GetQuestionsParams } from './shared.types.d'

import Question from '@/database/question.model'
import Tag from '@/database/tag.model'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../mongoose'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase()

    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 })
      .exec()

    return { questions }
  } catch (error) {}
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase()

    const { title, content, tags, author, path } = params

    const question = await Question.create({ title, content, author })

    const tagDocuments = await Promise.all(
      tags.map(async (tag: string) => {
        return await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
          { $setOnInsert: { name: tag }, $push: { question: question._id } },
          { upsert: true, new: true }
        ).exec()
      })
    )

    await Question.updateOne(
      { _id: question._id },
      { $push: { tags: { $each: tagDocuments } } }
    ).exec()

    revalidatePath(path)
  } catch (error) {
    console.log('error', error)
  }
}
