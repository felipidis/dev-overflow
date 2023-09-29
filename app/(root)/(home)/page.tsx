import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchBar from '@/components/shared/search/LocalSearchBar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import Link from 'next/link'

export default function Home() {
  const questions = [
    {
      _id: '1',
      title: 'Como criar um array em JavaScript?',
      tags: [
        { _id: '101', name: 'JavaScript' },
        { _id: '102', name: 'Programação' }
      ],
      author: {
        _id: 'author1',
        name: 'Alice',
        picture: 'picture1'
      },
      upvotes: 15,
      views: 100,
      answers: [
        {
          // Add answer object properties here
        }
      ],
      createdAt: new Date('2023-09-28T10:00:00Z')
    },
    {
      _id: '2',
      title: 'Qual é a diferença entre HTML e XHTML?',
      tags: [
        { _id: '103', name: 'HTML' },
        { _id: '104', name: 'Web Development' }
      ],
      author: {
        _id: 'author2',
        name: 'Bob',
        picture: 'picture2'
      },
      upvotes: 10,
      views: 80,
      answers: [
        {
          // Add answer object properties here
        }
      ],
      createdAt: new Date('2023-09-27T14:30:00Z')
    },
    {
      _id: '3',
      title: 'Como otimizar consultas SQL complexas?',
      tags: [
        { _id: '105', name: 'SQL' },
        { _id: '106', name: 'Banco de Dados' }
      ],
      author: {
        _id: 'author3',
        name: 'Charlie',
        picture: 'picture3'
      },
      upvotes: 20,
      views: 150,
      answers: [
        {
          // Add answer object properties here
        }
      ],
      createdAt: new Date('2023-09-26T17:45:00Z')
    }
  ]

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
          placeholder='Select a Filter'
          otherClasses='min-h-[56px] sm:min-w-[170px]'
          containerClasses='hidden max-md:flex'
        />
      </div>

      <HomeFilters />

      <div className='mt-10 flex w-full flex-col gap-6'>
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              answers={question.answers}
              author={question.author}
              createdAt={question.createdAt}
              tags={question.tags}
              title={question.title}
              upvotes={question.upvotes}
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
    </>
  )
}
