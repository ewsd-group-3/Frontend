import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { MenuLinks } from '@/constants/links'
import BrandTitle from './brand-title'
import AvatarIcon from '../AvatarIcon/avatar-icon'
import { authState } from '@/states/auth'
import { useRecoilValue } from 'recoil'

export default function MobileMenu({ pathName, handleLogout }: { pathName: string; handleLogout: () => void }) {
  const auth = useRecoilValue(authState)
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)

  return (
    <div>
      {isHamburgerOpen && (
        <div className='fixed top-0 left-0 z-50 h-screen w-full bg-primary'>
          <div className='flex h-16 justify-between p-5'>
            <BrandTitle />
            <div className='grid cursor-pointer place-items-center' onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}>
              <X size={30} color='white' />
            </div>
          </div>
          <div className='flex flex-col gap-y-2 px-5 pt-5 h-full'>
            {MenuLinks.map(Menu => {
              if (Menu.allowedRoles.includes(auth?.staff?.role ?? 'STAFF'))
                return (
                  <Link
                    href={Menu.path}
                    key={Menu.path}
                    className={`flex items-center gap-4 rounded p-4 ${pathName === Menu.path ? 'bg-white ' : 'bg-primary'}`}
                    onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                  >
                    <Menu.src size={22} color={pathName === Menu.path ? 'black' : 'white'} />
                    <div className={`${pathName === Menu.path ? 'text-black' : 'text-white'}`}>{Menu.title}</div>
                  </Link>
                )
            })}
            <div className='mt-auto h-[200px]'>
              <Link href={'/profile'} className={`flex items-center gap-4 rounded p-4 ${pathName === '/profile' ? 'bg-white ' : 'bg-primary'}`}>
                <AvatarIcon name={auth?.staff?.name ?? ''} />
                <div className={`${pathName === '/profile' ? 'text-black' : 'text-white'}`}>{auth?.staff?.name}</div>
              </Link>
              <button className='flex items-center gap-4 rounded bg-primary p-4 text-white' onClick={handleLogout}>
                Logout
              </button>
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
