import { getUserQuestions } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import QuestionCard from '../cards/QuestionCard'
import Pagination from './Pagination'

type Props = SearchParamsProps & {
  userId: string
  clerkId?: string
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const results = await getUserQuestions({
    userId,
    page: searchParams.page ? Number(searchParams.page) : 1
  })

  return (
    <>
      {results.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes.length}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}

      <div className='mt-10'>
        <Pagination
          pageNumber={searchParams?.page ? Number(searchParams.page) : 1}
          isNext={results.isNext}
        />
      </div>
    </>
  )
}

export default QuestionTab
