import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getDateDistance } from '@/lib/utils'
import { MoreVertical } from 'lucide-react'
import { useRouter } from 'next/router'
import ReactHtmlParser from 'react-html-parser'
import AvatarIcon from '../AvatarIcon/avatar-icon'
import { Button } from './button'
import Divider from './divider'

const Post = ({
  id,
  authorName,
  title,
  description,
  likeCount,
  dislikeCount,
  commentCount,
  createDate,
  isAnonymous,
}: {
  id: number
  authorName: string
  title: string
  description: string
  likeCount: number
  dislikeCount: number
  commentCount: number
  createDate: string
  isAnonymous: boolean
}) => {
  const router = useRouter()

  return (
    <div>
      <div
        onClick={() => {
          router.push(`/ideas/${id}`)
        }}
        className='w-full my-4 text-black rounded-lg flex flex-col gap-3 p-4 hover:bg-lightgray bg-lightgray/30 shadow cursor-pointer transition-all'
      >
        <div className='flex justify-between'>
          <div className='flex gap-2 items-center text-sm'>
            <AvatarIcon name={isAnonymous ? 'Anonymous' : authorName} size='sm' />
            <span>Posted by {isAnonymous ? 'Anonymous' : authorName} </span>
            <div className='w-1 h-1 bg-black rounded-full' />
            <time>{getDateDistance(createDate)}</time>
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
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    alert('edit')
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    alert('Report')
                  }}
                >
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <h4 className='font-bold text-lg'>{title}</h4>
        <div>
          {ReactHtmlParser(description.substring(0, 300))}{' '}
          {description.length > 300 && <small className='text-sm font-bold text-gray-500'>... See more</small>}
        </div>
        <div className='flex text-sm gap-2'>
          <p>{likeCount} likes</p>
          <Divider intent={'vertical'} className='h-5' />
          <p>{dislikeCount} dislikes</p>
          <Divider intent={'vertical'} className='h-5' />
          <p>{commentCount} comments</p>
        </div>
      </div>
    </div>
  )
}

export default Post
