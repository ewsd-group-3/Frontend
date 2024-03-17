import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import AvatarIcon from '../AvatarIcon/avatar-icon'
import { cn } from '@/lib/utils'

type MenuLinkProps = {
  path?: string
  gap?: boolean
  title: string
  icon: {
    src: LucideIcon
    img?: string
  }
  pathName: string
}

const MenuLink: FC<MenuLinkProps> = ({ path, icon, title, gap, pathName }) => {
  const content = (
    <li
      className={`group flex rounded-md p-2 cursor-pointer text-gray-300 text-sm items-center gap-x-4 font-medium hover:bg-background ${
        pathName === path && 'bg-gray-100 text-black'
      } ${gap ? 'mt-9' : 'mt-2'}`}
    >
      <span>
        {icon.img !== undefined ? (
          <AvatarIcon name={title} />
        ) : (
          <icon.src size={20} className='group-hover:stroke-black' color={pathName === path ? 'black' : 'white'} />
        )}
      </span>
      <span
        className={cn([
          'group-hover:text-black whitespace-nowrap',
          {
            'text-black': pathName === path,
            'text-zinc-300': pathName !== path,
          },
        ])}
      >
        {title}
      </span>
    </li>
  )

  return path ? <Link href={path}>{content}</Link> : <>{content}</>
}

export default MenuLink
