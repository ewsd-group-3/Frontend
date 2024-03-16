import { FC, useState } from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type MenuLinkProps = {
  path?: string
  gap?: boolean
  title: string
  icon: {
    src: LucideIcon
    img?: string
  }
  pathName: string
  open: boolean | null
}

const MenuLink: FC<MenuLinkProps> = ({ path, icon, title, gap, pathName, open }) => {
  const [hovered, setHovered] = useState(false)

  const content = (
    <li
      className={`group flex rounded-md p-2 cursor-pointer text-gray-300 text-sm items-center gap-x-4 font-medium ${
        pathName === path ? 'bg-gray-100 text-black' : hovered ? 'hover:bg-background' : ''
      } ${gap ? 'mt-9' : 'mt-2'}`}
      onMouseEnter={() => {
        setHovered(true)
      }}
      onMouseLeave={() => {
        setHovered(false)
      }}
    >
      <span>
        {icon.img !== undefined ? (
          <Avatar className='h-7 w-7'>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${icon.img}`} />
            <AvatarFallback>{title}</AvatarFallback>
          </Avatar>
        ) : (
          <icon.src size={22} color={hovered || pathName === path ? 'black' : 'white'} />
        )}
      </span>
      <span className={`${!open && 'hidden'} group-hover:text-black whitespace-nowrap ${pathName === path ? 'text-black' : 'text-zinc-300'}`}>
        {title}
      </span>
    </li>
  )

  return path ? <Link href={path}>{content}</Link> : <>{content}</>
}

export default MenuLink
