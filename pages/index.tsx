import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import Post from '@/components/ui/post'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <main className='px-7 flex '>
      <div>
        <div className='p-4 flex rounded-lg shadow-lg gap-3 items-center mb-10'>
          <AvatarIcon name='Admin' size='base' />
          <button
            onClick={() => {
              router.push('/ideas/create')
            }}
            className='w-full p-3 bg-[#EEEEEE] text-left text-sm rounded-md text-gray-500'
          >
            Create Idea
          </button>
        </div>

        <div className='divide-y space-y-2 divide-gray-400'>
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      </div>

      <div className='basis-1/3 h-10'></div>
    </main>
  )
}
