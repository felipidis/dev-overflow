import AnswerForm from '@/components/forms/AnswerForm'
import AllAnswers from '@/components/shared/AllAnswers'
import Metric from '@/components/shared/Metric'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import Votes from '@/components/shared/Votes'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { formatLargeNumber, getTimeStamp } from '@/lib/utils'
import { URLProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

const QuestionDetails = async ({ params, searchParams }: URLProps) => {
  const question = await getQuestionById({ questionId: params.id })
  const { userId: clerkId } = auth()

  let mongoUser
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId })
  }

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link
            href={`/profile/${question.author.clerkId}`}
            className='flex items-center justify-start gap-1'
          >
            <Image
              src={question.author.picture}
              alt='author profile'
              width={22}
              height={22}
              className='rounded-full'
            />
            <p className='paragraph-semibold text-dark300_light700'>
              {question.author.name}
            </p>
          </Link>
          <div className='flex justify-end'>
            <Votes
              type='Question'
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={question.upvotes.length}
              hasUpVoted={question.upvotes.includes(mongoUser._id)}
              downvotes={question.downvotes.length}
              hasDownVoted={question.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {question.title}
        </h2>
      </div>

      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
        <Metric
          imgUrl='/assets/icons/clock.svg'
          alt='Upvotes'
          value={`Asked ${getTimeStamp(question.createdAt)}`}
          title=''
          textStyles='small-medium text-dark400_light800'
        />

        <Metric
          imgUrl='/assets/icons/message.svg'
          alt='Message'
          value={formatLargeNumber(question.answers.length)}
          title=' Answers'
          textStyles='small-medium text-dark400_light800'
        />

        <Metric
          imgUrl='/assets/icons/eye.svg'
          alt='Eye'
          value={formatLargeNumber(question.views)}
          title=' Views'
          textStyles='small-medium text-dark400_light800'
        />
      </div>

      <ParseHTML data={question.content} />

      <div className='mt-8 flex flex-wrap gap-2'>
        {question.tags.map((tag: any) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <AllAnswers
        questionId={question._id}
        userId={JSON.stringify(mongoUser._id)}
        totalAnswers={question.answers.length}
        filter={searchParams?.filter}
      />

      <AnswerForm
        authorId={JSON.stringify(mongoUser._id)}
        question={question.content}
        questionId={JSON.stringify(question._id)}
      />
    </>
  )
}

export default QuestionDetails
