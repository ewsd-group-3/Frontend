import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronFirst, LogOut, Menu, User } from 'lucide-react'
import { MenuLinks } from '@/constants/links'
import SchoolLogo from '@/public/wayne-school-logo.svg'
import Image from 'next/image'
import MenuLink from './menu-link'
import MobileMenu from './mobile-menu'
import { useRecoilState } from 'recoil'
import { authState } from '@/states/auth'
import { cn, showDialog } from '@/lib/utils'
import { useRouter } from 'next/router'
import { dialogState } from '@/states/dialog'
import { LoadingSpinner } from '../ui/loading-spinner'
import { formateDate } from '@/lib/date'
import { useFetch } from '@/hooks/useQuery'
import { ProfileRes } from '@/types/api'

function getLocalIsSidebarOpen() {
  return localStorage.getItem('isSidebarOpen') === 'true' ? true : false
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isInitial, setIsInitial] = useState(true)
  const [auth, setAuth] = useRecoilState(authState)
  const [dialog, setDialog] = useRecoilState(dialogState)
  const pathName = usePathname()
  const [open, setOpen] = useState(typeof window !== 'undefined' ? getLocalIsSidebarOpen : null)
  const { data, isLoading } = useFetch<ProfileRes, true>(`staffs/${auth?.staff.id}`)
  const profile = data?.data?.staff

  useEffect(() => {
    if (auth === undefined) {
      router.push('/login')
    } else if (auth && router.pathname === '/login') {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  useEffect(() => {
    setIsInitial(false)
  }, [])

  const handleLogout = () => {
    setAuth(undefined)
    setDialog(undefined)
    router.push('/login')
  }

  if (isInitial) return <LoadingSpinner />

  return (
    <>
      {auth && <MobileMenu handleLogout={handleLogout} pathName={pathName} />}

      <div className='flex'>
        <div
          className={`${open ? `w-72` : `w-20`} fixed z-50 h-screen flex-col justify-between bg-primary p-5 pt-7 duration-300 ${auth ? 'hidden md:flex' : 'hidden'}`}
        >
          <div
            className={`absolute -right-3 top-9 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-accent ring-2 ring-background  ${
              !open && 'rotate-180'
            }`}
            onClick={() => {
              localStorage.setItem('isSidebarOpen', `${!open}`)
              setOpen(getLocalIsSidebarOpen)
            }}
          >
            <ChevronFirst size={18} color='white' />
          </div>

          <div className='overflow-hidden'>
            <div className='flex items-center gap-x-4'>
              <Image src={SchoolLogo} className={`rounded-full ${!open && ''}`} width={36} height={36} alt='logo' />
              <h1 className={`text-md origin-left whitespace-nowrap font-medium text-white duration-300 ${!open && 'hidden'}`}>
                Wayne School Portal
              </h1>
            </div>
            <ul className='pt-6'>
              {MenuLinks.map(Menu => {
                if (Menu.allowedRoles.includes(auth?.staff?.role ?? 'STAFF'))
                  return (
                    <MenuLink
                      icon={{
                        src: Menu.src,
                      }}
                      path={Menu.path}
                      title={Menu.title}
                      gap={Menu.gap}
                      key={Menu.path}
                      pathName={pathName}
                    />
                  )
              })}
            </ul>
          </div>

          <div className='overflow-hidden'>
            <p
              className={cn('text-sm text-gray-300 mb-2 opacity-0 delay-300', {
                'opacity-100': open,
                'transition-none': !open,
                'transition-all': open,
              })}
            >
              {auth?.firstTimeLogin
                ? 'Welcome to Wayne School Portal!'
                : `Last active: ${formateDate(profile?.lastLoginDate, 'd MMM y, hh:mm:ss a')}`}
            </p>

            <hr />
            <MenuLink
              icon={{
                src: User,
                img: auth?.staff?.name,
              }}
              path={'/profile'}
              pathName={pathName}
              title={auth?.staff?.name || 'User Name'}
            />
            <div
              onClick={() =>
                showDialog({
                  title: 'Loging out',
                  children: (
                    <div className='mt-5'>
                      <p>Are you sure you want to log out from the portal?</p>
                    </div>
                  ),
                  cancel: true,
                  action: { label: 'Confirm', onClick: () => handleLogout() },
                })
              }
            >
              <MenuLink
                icon={{
                  src: LogOut,
                }}
                pathName={pathName}
                title={'Logout'}
              />
            </div>
          </div>
        </div>
        <main className={`md:max-w-[1440px] max-w-full mx-auto mt-16 flex-1 p-3 md:p-5 pt-3 duration-300 md:mt-0`}>
          <div className={`${auth ? (open ? `md:ml-72` : `md:ml-20`) : 'ml-0'} transition-all`}>{children}</div>
        </main>
      </div>
    </>
  )
}
