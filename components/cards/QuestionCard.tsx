import { formatLargeNumber, getTimeStamp } from '@/lib/utils'
import Link from 'next/link'
import Metric from '../shared/Metric'
import RenderTag from '../shared/RenderTag'

type Author = {
  _id: string
  name: string
  picture: string
}

type Tag = {
  _id: string
  name: string
}

type QuestionCardProps = {
  _id: string
  clerkId?: string
  title: string
  tags: Tag[]
  author: Author
  upvotes: number
  views: number
  answers: Array<object>
  createdAt: Date
}
const QuestionCard = ({
  _id,
  clerkId,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt
}: QuestionCardProps) => {
  return (
    <div className=' card-wrapper rounded-[10px] border px-11 py-9 dark:border-none'>
      <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <Link href={`/question/${_id}`}>
          <h2 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
            {title}
          </h2>
        </Link>

        <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
          {getTimeStamp(createdAt)}
        </span>
      </div>

      <div className=' mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric
          imgUrl={author.picture}
          alt='User'
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles='body-medium text-dark400_light700'
        />

        <Metric
          imgUrl='/assets/icons/like.svg'
          alt='Upvotes'
          value={formatLargeNumber(upvotes)}
          title=' Votes'
          textStyles='small-medium text-dark400_light800'
        />

        <Metric
          imgUrl='/assets/icons/message.svg'
          alt='Message'
          value={formatLargeNumber(answers.length)}
          title=' Answers'
          textStyles='small-medium text-dark400_light800'
        />

        <Metric
          imgUrl='/assets/icons/eye.svg'
          alt='Eye'
          value={formatLargeNumber(views)}
          title=' Views'
          textStyles='small-medium text-dark400_light800'
        />
      </div>
    </div>
  )
}

export default QuestionCard
