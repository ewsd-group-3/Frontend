import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronFirst, LogOut, Menu, User } from 'lucide-react'
import { MenuLinks } from '@/constants/links'
import SchoolLogo from '@/public/wyne-school-logo.svg'
import Image from 'next/image'
import MenuLink from './menu-link'
import MobileMenu from './mobile-menu'
import { useRecoilState } from 'recoil'
import { authState } from '@/states/auth'
import { showDialog } from '@/lib/utils'
import { useRouter } from 'next/router'
import { dialogState } from '@/states/dialog'

function getLocalIsSidebarOpen() {
  return localStorage.getItem('isSidebarOpen') === 'true' ? true : false
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useRecoilState(authState)
  const [dialog, setDialog] = useRecoilState(dialogState)
  const [mount, setMount] = useState(false)
  const pathName = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(typeof window !== 'undefined' ? getLocalIsSidebarOpen : null)

  useEffect(() => {
    setMount(true)
    if (mount) {
      if (auth === undefined) {
        router.push('/login')
      } else if (auth && router.pathname === '/login') {
        router.push('/')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, mount])

  const handleLogout = () => {
    setAuth(undefined)
    setDialog(undefined)
    router.push('/login')
  }

  return (
    <>
      {mount && (
        <>
          {auth && <MobileMenu auth={auth} handleLogout={handleLogout} pathName={pathName} />}

          <div className='flex'>
            <div
              className={`${open ? `w-72` : `w-20`} fixed h-screen flex-col justify-between bg-primary p-5 pt-7 duration-300 ${auth ? 'hidden md:flex' : 'hidden'}`}
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

              <div>
                <div className='flex items-center gap-x-4'>
                  <Image src={SchoolLogo} className={`rounded-full ${!open && ''}`} width={40} height={40} alt='logo' />
                  <h1 className={`text-md origin-left whitespace-nowrap font-medium text-white duration-300 ${!open && 'hidden'}`}>
                    Wyne School Portal
                  </h1>
                </div>
                <ul className='pt-6'>
                  {MenuLinks.map(Menu => (
                    <MenuLink
                      icon={{
                        src: Menu.src,
                      }}
                      path={Menu.path}
                      title={Menu.title}
                      gap={Menu.gap}
                      key={Menu.path}
                      pathName={pathName}
                      open={open}
                    />
                  ))}
                </ul>
              </div>

              <div>
                <hr className='mb-6 mt-9' />
                <MenuLink
                  icon={{
                    src: User,
                    img: auth?.staff.name,
                  }}
                  path={'/profile'}
                  pathName={pathName}
                  title={auth?.staff.name || 'User Name'}
                  open={open}
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
                    open={open}
                  />
                </div>
              </div>
            </div>

            <main className={`mt-16 flex-1 p-5 pt-3 duration-300 md:mt-0 ${auth ? (open ? `md:ml-72` : `md:ml-20`) : 'ml-0'}`}>{children}</main>
          </div>
        </>
      )}
    </>
  )
}
