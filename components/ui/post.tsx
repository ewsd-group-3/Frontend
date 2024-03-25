import React from 'react'
import { Avatar } from './avatar'
import AvatarIcon from '../AvatarIcon/avatar-icon'
import Divider from './divider'
import { useRouter } from 'next/router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { Button } from './button'
import { formatDistance } from 'date-fns'
import { getDateDistance } from '@/lib/utils'

const Post = ({
  id,
  authorName,
  title,
  description,
  likeCount,
  dislikeCount,
  commentCount,
  createDate,
}: {
  id: number
  authorName: string
  title: string
  description: string
  likeCount: number
  dislikeCount: number
  commentCount: number
  createDate: string
}) => {
  const router = useRouter()

  return (
    <div>
      <div
        onClick={() => {
          router.push(`/ideas/${id}`)
        }}
        className='w-full mt-2 text-black rounded-lg flex flex-col gap-3 p-4 hover:bg-lightgray'
      >
        <div className='flex justify-between'>
          <div className='flex gap-2 items-center text-sm'>
            <AvatarIcon name={authorName} size='sm' />
            <span>Posted by {authorName} </span>
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
        <p className='text-sm'>{description}</p>

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
