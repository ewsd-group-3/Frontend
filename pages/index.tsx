import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import DataPagination from '@/components/Pagination/data-pagination'
import FullPageLoader from '@/components/shared/full-page-loader'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Post from '@/components/ui/post'
import { useFetchListing } from '@/hooks/useFetchListing'
import { useFetch } from '@/hooks/useQuery'
import useSemester from '@/hooks/useSemester'
import { formateDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import { currentSemesterState } from '@/states'
import { authState } from '@/states/auth'
import { CategoryRes, IdeaRes } from '@/types/api'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const sortByIdea = [
  {
    label: 'Most recent post',
    value: 'createdAt',
  },
  {
    label: 'Most view',
    value: 'totalViewCount',
  },
  {
    label: 'Most voted',
    value: 'voteResult',
  },
]

export default function Home() {
  const router = useRouter()
  const [auth] = useRecoilState(authState)

  const { isBeforeClosureDate } = useSemester()
  const isIdeaClosed = !isBeforeClosureDate()

  const [sortBy, setSortBy] = useState('createdAt')
  const [categoryId, setCategoryId] = useState<number>(0)
  const currentSemester = useRecoilValue(currentSemesterState)

  const { data, isLoading, error } = useFetchListing<IdeaRes>(
    `/ideas?categoryId=${categoryId}`,
    {
      sortBy: sortBy,
      sortType: 'desc',
      page: '1',
      limit: 5,
    },
    false,
  )

  const { data: categoryData } = useFetch<CategoryRes, true>('categories?limit=100')
  const ideas = data?.data?.ideas ?? []
  const categories = categoryData?.data?.categories

  // @ts-ignore
  if (data?.response?.data?.statusCode) {
    return (
      <div className='flex justify-center items-center h-screen flex-col gap-5'>
        <h1 className='text-5xl'>No Ideas to show!</h1>
        <p>Sorry, there is no active semester right now.</p>
      </div>
    )
  }

  return (
    <main className='flex'>
      <div className='w-full'>
        {currentSemester?.name && (
          <div className='bg-primary text-white w-full p-3 mb-3 text-center text-sm rounded-md sticky top-0 left-0 z-30'>
            {isIdeaClosed
              ? `The idea posting for ${currentSemester?.name} is closed`
              : `Idea posting for ${currentSemester?.name} will be closed on ${formateDate(currentSemester?.closureDate)}`}
          </div>
        )}
        <div className='p-4 rounded-lg shadow-lg mb-10'>
          <div className='flex items-center gap-3 '>
            <AvatarIcon name={auth?.staff.name || ''} size='base' />
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
          <div>
            <div className='flex flex-col sm:flex-row'>
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none'>
                  <div className='flex gap-3  px-5 py-2 rounded-full text-sm items-center hover:backdrop-brightness-95 outline-none'>
                    {sortByIdea.find(idea => idea.value === sortBy)?.label} <ChevronDown />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sortByIdea.map(item => (
                    <DropdownMenuItem
                      key={item.value}
                      className={cn({ 'bg-primary text-primary-foreground': sortBy === item.value })}
                      onSelect={() => setSortBy(item.value)}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none'>
                  <div className='flex gap-3  px-5 py-2 rounded-full text-sm items-center hover:backdrop-brightness-95 outline-none'>
                    {categories?.find(category => category?.id === categoryId)?.name ?? 'All categories'} <ChevronDown />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    key={'all'}
                    className={cn({ 'bg-primary text-primary-foreground': categoryId === 0 })}
                    onSelect={() => setCategoryId(0)}
                  >
                    All categories
                  </DropdownMenuItem>
                  {categories?.map(category => (
                    <DropdownMenuItem
                      key={category.id}
                      className={cn({ 'bg-primary text-primary-foreground': categoryId === category.id })}
                      onSelect={() => setCategoryId(category.id)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

                const firstImage = idea.ideaDocuments.find(doc => doc.documenttype.includes('image'))?.documentDownloadUrl

                return (
                  <Post
                    key={idea.id}
                    id={idea.id}
                    authorId={idea.authorId}
                    authorName={idea.author.name}
                    commentCount={idea.comments.length}
                    description={idea.description}
                    title={idea.title}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                    createDate={idea.createdAt}
                    isAnonymous={idea.isAnonymous}
                    viewCount={idea?.views?.length ?? 0}
                    imageUrl={firstImage}
                    ideaCategories={idea?.ideaCategories}
                  />
                )
              })}
            </div>
            {data && (
              <div className='mt-3'>
                <DataPagination currentPage={data?.data?.page} totalPage={data?.data?.totalPages} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
