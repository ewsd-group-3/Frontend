import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { MenuLinks } from '@/constants/links'
import BrandTitle from './brand-title'
import { LoggedInData } from '@/types/auth'
import Image from 'next/image'
import SchoolLogo from '@/public/wyne-school-logo.svg'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import AvatarIcon from '../AvatarIcon/avatar-icon'
import { title } from 'process'

export default function MobileMenu({ pathName, auth, handleLogout }: { pathName: string; auth: LoggedInData; handleLogout: () => void }) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)

  return (
    <div>
      {isHamburgerOpen && (
        <div className='fixed z-50 h-screen w-full bg-primary'>
          <div className='flex h-16 justify-between p-5'>
            <BrandTitle />
            <div className='grid cursor-pointer place-items-center' onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}>
              <X size={30} color='white' />B
            </div>
          </div>
          <div className='flex flex-col gap-y-2 px-5 pt-5'>
            {MenuLinks.map(Menu => (
              <Link
                href={Menu.path}
                key={Menu.path}
                className={`flex items-center gap-4 rounded p-4 ${pathName === Menu.path ? 'bg-white ' : 'bg-primary'}`}
                onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              >
                <Menu.src size={22} color={pathName === Menu.path ? 'black' : 'white'} />
                <div className={`${pathName === Menu.path ? 'text-black' : 'text-white'}`}>{Menu.title}</div>
              </Link>
            ))}
            <Link href={'/profile'} className={`flex items-center gap-4 rounded p-4 ${pathName === '/profile' ? 'bg-white ' : 'bg-primary'}`}>
              <AvatarIcon name={auth.staff.name} />
              <div className={`${pathName === '/profile' ? 'text-black' : 'text-white'}`}>{auth.staff.name}</div>
            </Link>
            <div className='flex cursor-pointer items-center gap-4 rounded bg-primary p-4 text-white' onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      )}
      <div className='fixed z-40 flex h-16 w-full bg-primary md:hidden'>
        <div className='flex w-full items-center justify-between bg-primary p-5'>
          <BrandTitle />
          <div className='grid cursor-pointer place-items-center' onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}>
            <Menu size={30} color='white' />
          </div>
        </div>
      </div>
    </div>
  )
}
