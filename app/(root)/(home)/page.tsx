import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import LocalSearchBar from '@/components/shared/search/LocalSearchBar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import {
  getQuestions,
  getRecommendedQuestions
} from '@/lib/actions/question.action'
import { SearchParamsProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth()
  let results

  if (searchParams.filter === 'recommended') {
    if (userId) {
      results = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? Number(searchParams.page) : 1
      })
    } else {
      results = {
        questions: [],
        isNext: false
      }
    }
  } else {
    results = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? Number(searchParams.page) : 1
    })
  }

  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center '>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
        <Link
          className=' flex justify-end max-sm:w-full'
          href={'/ask-question'}
        >
          <Button className='primary-gradient min-h-[46px] px-4 py-3 text-light-900'>
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchBar
          route='/'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search questions...'
          otherClasses='flex-1'
        />
        <Filter
          filters={HomePageFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
          containerClasses='hidden max-md:flex'
        />
      </div>

      <HomeFilters />

      <div className='mt-10 flex w-full flex-col gap-6'>
        {results?.questions?.length > 0 ? (
          results?.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              answers={question.answers}
              author={question.author}
              createdAt={question.createdAt}
              tags={question.tags}
              title={question.title}
              upvotes={question.upvotes.length}
              views={question.views}
            />
          ))
        ) : (
          <NoResult
            description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
            title='There’s no question to show'
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )}
      </div>

      <div className='mt-10'>
        <Pagination
          pageNumber={searchParams?.page ? Number(searchParams.page) : 1}
          isNext={results?.isNext}
        />
      </div>
    </>
  )
}

export default Home
