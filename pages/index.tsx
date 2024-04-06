import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import FullPageLoader from '@/components/shared/full-page-loader'
import Post from '@/components/ui/post'
import { useFetchListing } from '@/hooks/useFetchListing'
import { IdeaRes } from '@/types/api'
import { useRouter } from 'next/router'
import DataPagination from '@/components/Pagination/data-pagination'
import { useRecoilValue } from 'recoil'
import { currentSemesterState } from '@/states'
import { formateDate } from '@/lib/date'
import useSemester from '@/hooks/useSemester'
import { cn } from '@/lib/utils'

export default function Home() {
  const router = useRouter()

  const { data, isLoading } = useFetchListing<IdeaRes>('/ideas', {
    sortBy: 'createdAt',
    sortType: 'desc',
    page: '1',
    limit: 5,
  })

  const { isBeforeClosureDate } = useSemester()
  const currentSemester = useRecoilValue(currentSemesterState)

  const ideas = data?.data?.ideas ?? []
  const isIdeaClosed = !isBeforeClosureDate()

  return (
    <main className='flex'>
      <div className='w-full'>
        {currentSemester?.name && (
          <div className='bg-primary sticky top-0 left-0 z-30 px-2 text-white w-full py-3 text-center text-sm rounded-md'>
            {isIdeaClosed
              ? `The idea posting for ${currentSemester?.name} is closed`
              : `Idea posting for ${currentSemester?.name} will be closed on ${formateDate(currentSemester?.closureDate)}`}
          </div>
        )}
        <div className='p-4 rounded-lg shadow-lg mb-10'>
          <div className='flex items-center gap-3 '>
            <AvatarIcon name='Admin' size='base' />
            <button
              disabled={isIdeaClosed}
              onClick={() => {
                if (isIdeaClosed) {
                  return
                }
                router.push('/ideas/create')
              }}
              className={cn('w-full p-3 bg-[#EEEEEE] text-left text-sm rounded-md text-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed')}
            >
              Create Idea
            </button>
          </div>
        </div>

        {isLoading || !ideas ? (
          <div className='-mt-16'>
            <FullPageLoader />
          </div>
        ) : (
          <div className='divide-y space-y-2 divide-gray-400'>
            {ideas.map(idea => {
              let likeCount = 0
              let dislikeCount = 0
              idea.votes.forEach(vote => {
                if (vote.isThumbUp) {
                  likeCount++
                } else {
                  dislikeCount++
                }
              })

              return (
                <Post
                  key={idea.id}
                  id={idea.id}
                  authorName={idea.author.name}
                  commentCount={idea.comments.length}
                  description={idea.description}
                  title={idea.title}
                  likeCount={likeCount}
                  dislikeCount={dislikeCount}
                  createDate={idea.createdAt}
                  isAnonymous={idea.isAnonymous}
                />
              )
            })}
          </div>
        )}

        {data && (
          <div className='mt-3'>
            <DataPagination currentPage={data?.data?.page} totalPage={data?.data?.totalPages} />
          </div>
        )}
      </div>
    </main>
  )
}
