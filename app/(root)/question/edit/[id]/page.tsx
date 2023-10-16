import QuestionForm from '@/components/forms/QuestionForm'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { ParamsProps } from '@/types'
import { auth } from '@clerk/nextjs'

const EditQuestion = async ({ params }: ParamsProps) => {
  const { userId } = auth()

  if (!userId) return null

  const mongoUser = await getUserById({ userId })
  const question = await getQuestionById({ questionId: params.id })

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>EditQuestion</h1>

      <div className='mt-9'>
        <QuestionForm
          type='Edit'
          mongoUserId={mongoUser._id}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  )
}

export default EditQuestion
