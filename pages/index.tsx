import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import FullPageLoader from '@/components/shared/full-page-loader'
import Post from '@/components/ui/post'
import { useFetchListing } from '@/hooks/useFetchListing'
import { IdeaRes } from '@/types/api'
import { useRouter } from 'next/router'
import DataPagination from '@/components/Pagination/data-pagination'

export default function Home() {
  const router = useRouter()

  const { data, isLoading } = useFetchListing<IdeaRes>('/ideas', {
    sortBy: 'createdAt',
    sortType: 'desc',
    page: '1',
    limit: 5,
  })

  const ideas = data?.data?.ideas ?? []

  return (
    <main className='flex'>
      <div className='w-full'>
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
            <DataPagination currentPage={data?.data.page} totalPage={data?.data.totalPages} />
          </div>
        )}
      </div>
    </main>
  )
}
