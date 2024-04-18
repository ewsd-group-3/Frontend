import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getDateDistance, hideDialog, showDialog } from '@/lib/utils'
import { ArrowBigDown, ArrowBigUp, ArrowDown, EyeIcon, MessageSquare, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/router'
import ReactHtmlParser from 'react-html-parser'
import AvatarIcon from '../AvatarIcon/avatar-icon'
import { Button } from './button'
import Divider from './divider'
import { useMutate } from '@/hooks/useQuery'
import { Input } from './input'
import { z } from 'zod'
import RichTextEditor from './rich-text-editor'
import { useRecoilState } from 'recoil'
import { authState } from '@/states/auth'
import Image from 'next/image'
import { IdeaCategory } from '@/types/api'

const Post = ({
  id,
  authorId,
  authorName,
  title,
  description,
  viewCount,
  likeCount,
  dislikeCount,
  commentCount,
  createDate,
  isAnonymous,
  imageUrl,
  ideaCategories,
}: {
  id: number
  authorId: number
  authorName: string
  title: string
  description: string
  viewCount: number
  likeCount: number
  dislikeCount: number
  commentCount: number
  createDate: string
  isAnonymous: boolean
  imageUrl?: string
  ideaCategories: IdeaCategory[]
}) => {
  const [auth] = useRecoilState(authState)
  const router = useRouter()
  const { mutateAsync } = useMutate()

  const handleEditIdea = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    const value = {
      title,
      description,
    }

    showDialog({
      title: 'Update Idea',
      defaultValues: value,
      formSchema: z.object({
        title: z.string().min(1, { message: 'Title is required.' }),
        description: z.string().min(1, { message: 'Content is required.' }),
      }),
      children: (
        <div className='mt-5'>
          <Input.Field name='title' label='Idea title' className='mb-3' />
          <RichTextEditor name='description' label='Idea content' />
        </div>
      ),
      cancel: {
        label: 'Cancel',
      },
      action: {
        label: 'Submit',
      },
      onSubmit: async values => {
        const res = await mutateAsync({
          url: `ideas/${id}`,
          method: 'PATCH',
          payload: {
            title: values.title,
            description: values.description,
            isAnonymous,
          },
          invalidateUrls: [`/ideas`],
        })

        if (res.statusCode === 200) {
          hideDialog()
        }
      },
    })
  }

  const handleReportIdea = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    await mutateAsync({
      url: `reports`,
      payload: {
        ideaId: id,
        reason: 'Inappropriate content',
      },
      method: 'POST',
      invalidateUrls: [`/ideas`],
    })
  }

  return (
    <div>
      <div
        onClick={() => {
          router.push(`/ideas/${id}`)
        }}
        className='w-full my-4 text-black rounded-lg flex flex-col gap-3 p-4 hover:bg-lightgray bg-lightgray/30 shadow cursor-pointer transition-all'
      >
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 items-center text-sm'>
            <AvatarIcon name={isAnonymous ? 'Anonymous' : authorName} size='sm' />
            <span>
              <span className='hidden sm:inline'>Posted by</span> <span className='font-medium'>{isAnonymous ? 'Anonymous' : authorName}</span>
            </span>
            <div className='w-1 h-1 bg-black rounded-full' />
            <time>{getDateDistance(createDate)}</time>
            <div className='w-1 h-1 bg-black rounded-full' />
            <div className='flex gap-1 text-sm items-center'>
              <EyeIcon className='w-4' />
              {viewCount}
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {authorId === auth?.staff.id && <DropdownMenuItem onClick={e => handleEditIdea(e)}>Edit</DropdownMenuItem>}
                <DropdownMenuItem onClick={e => handleReportIdea(e)}>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='flex gap-2'>
          {ideaCategories.map(category => (
            <div key={category.id} className='px-2 py-1 text-xs rounded-full bg-foreground text-primary-foreground'>
              {category.category.name}
            </div>
          ))}
        </div>
        <h4 className='font-bold text-lg'>{title}</h4>
        <div>
          {ReactHtmlParser(description.substring(0, 150))}{' '}
          {description.length > 150 && <small className='text-sm font-bold text-gray-500'>... See more</small>}
        </div>
        {imageUrl && (
          <div className='w-64 rounded-lg overflow-hidden'>
            <Image width={256} height={200} src={imageUrl} alt={title} className='w-full h-full' />
          </div>
        )}
        <div className='flex text-sm gap-2'>
          <p className='flex items-center gap-1 font-medium'>
            {likeCount} <ArrowBigUp size={20} color='grey' />
          </p>
          <Divider intent={'vertical'} className='h-5' />
          <p className='flex items-center gap-1 font-medium'>
            {dislikeCount} <ArrowBigDown size={20} color='grey' />
          </p>
          <Divider intent={'vertical'} className='h-5' />
          <p className='flex items-center gap-1 font-medium'>
            {commentCount} <MessageSquare size={20} color='grey' />
          </p>
        </div>
      </div>
    </div>
  )
}

export default Post
