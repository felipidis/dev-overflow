'use client'
import { deleteAnswer } from '@/lib/actions/answer.action'
import { deleteQuestion } from '@/lib/actions/question.action'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  itemId: string
  type: 'Question' | 'Answer'
}
const EditDeleteAction = ({ itemId, type }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`)
  }

  const handleDelete = () => {
    if (type === 'Question') {
      deleteQuestion({ questionId: JSON.parse(itemId), path: pathname })
    } else {
      deleteAnswer({ answerId: JSON.parse(itemId), path: pathname })
    }
  }

  return (
    <div className='flex items-center justify-end gap-3 max-sm:w-full'>
      {type === 'Question' && (
        <Image
          src={'/assets/icons/edit.svg'}
          alt='edit question'
          width={14}
          height={14}
          className='cursor-pointer object-contain'
          onClick={handleEdit}
        />
      )}

      <Image
        src={'/assets/icons/trash.svg'}
        alt='delete question'
        width={14}
        height={14}
        className='cursor-pointer object-contain'
        onClick={handleDelete}
      />
    </div>
  )
}

export default EditDeleteAction
