import React from 'react'
import AvatarIcon from '../AvatarIcon/avatar-icon'
import { formateDate } from '@/lib/date'

interface ActiveUserInfoProps {
  name: string
  view: number
  comment: number
  idea: number
  vote: number
}

export default function ActiveUserInfo({ name, comment, idea, view, vote }: ActiveUserInfoProps) {
  return (
    <div className='grid grid-cols-2'>
      <div className='flex items-center'>
        <AvatarIcon name={name} />
        <div className='ml-2'>
          <div className='font-medium'>{name}</div>
        </div>
      </div>
      <div className='flex items-center gap-5 justify-end'>
        <span className='size-6 text-right font-medium pr-1'>{view}</span>
        <span className='size-6 text-right font-medium pr-1'>{vote}</span>
        <span className='size-6 text-right font-medium pr-1'>{comment}</span>
        <span className='size-6 text-right font-medium pr-1'>{idea}</span>
      </div>
    </div>
  )
}
