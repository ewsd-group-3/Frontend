import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowLeft, ArrowUp, Divide, EyeIcon, Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// import required modules
import { Pagination } from 'swiper/modules'
import Divider from '@/components/ui/divider'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useRecoilState } from 'recoil'
import { useRouter } from 'next/router'
import { useFetch } from '@/hooks/useQuery'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CommentI, Idea, IdeaDetail } from '@/types/api'
import { getDateDistance } from '@/lib/utils'
import { getIdeaCount } from '@/lib/ideas'
import { authState } from '@/states/auth'
import FullPageLoader from '@/components/shared/full-page-loader'

const CategoryChip = ({ name }: { name: string }) => {
  return <div className='px-3 py-1 text-sm rounded-full bg-foreground text-primary-foreground'>{name}</div>
}

type Reacted = {
  like: number
  dislike: number
  type: 'like' | 'dislike' | 'none'
}

const IdeaDetail = () => {
  const router = useRouter()
  const [auth] = useRecoilState(authState)
  const { data, isLoading } = useFetch<IdeaDetail, true>(`ideas/${router.query.id}`, {}, { enabled: !!router.query.id })

  const [reacted, setReacted] = useState<Reacted>({
    like: 0,
    dislike: 0,
    type: 'none',
  })
  const ideaData = data?.data

  const { likeCount, dislikeCount } = getIdeaCount(ideaData?.votes ?? [])

  useEffect(() => {
    console.log('here')
    setReacted({
      like: likeCount,
      dislike: dislikeCount,
      type: 'none',
    })
  }, [likeCount, dislikeCount])

  if (isLoading || !ideaData) return <FullPageLoader />

  const handleReactPost = (type: 'like' | 'dislike') => {
    if (reacted.type === 'none') {
      setReacted({
        ...reacted,
        [type]: reacted[type] + 1,
        type,
      })
    } else {
      if (reacted.type === type) {
        setReacted({
          ...reacted,
          [type]: reacted[type] - 1,
          type: 'none',
        })
      } else {
        const negatedReact = type === 'like' ? 'dislike' : 'like'
        setReacted({
          ...reacted,
          [type]: reacted[type] + 1,
          [negatedReact]: reacted[negatedReact] - 1,
          type,
        })
      }
    }
  }

  return (
    <div className='max-w-3xl p-4'>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <button onClick={() => router.push('/')} className='w-10 h-10 bg-primary/10 grid place-items-center rounded-full'>
            <ArrowLeft />
          </button>
          <div className='flex gap-2 items-center text-sm'>
            <AvatarIcon name={ideaData.author.name} size='sm' />
            <span>Posted by {ideaData.author.name} </span>
            <div className='w-1 h-1 bg-black rounded-full' />
            <time>{getDateDistance(ideaData.createdAt)}</time>
            <div className='w-1 h-1 bg-black rounded-full' />
            <span>Department Name</span>
          </div>
        </div>

        <div className='flex gap-1 text-sm items-center'>
          <EyeIcon />
          {ideaData.views.length}
        </div>
      </div>

      <div className='mt-4'>
        <h3 className='my-2 font-semibold text-2xl'>{ideaData.title}</h3>
        <div className='flex gap-2'>
          {ideaData.ideaCategories.map(category => (
            <CategoryChip key={category.id} name={category.category.name} />
          ))}
        </div>
      </div>

      <article className='mt-3 space-y-1'>{ideaData.description}</article>

      <section className='mt-10'>
        {ideaData.ideaDocuments.length > 0 && (
          <Swiper pagination={true} modules={[Pagination]} className='mySwiper rounded-lg'>
            {ideaData.ideaDocuments.map(document => (
              <SwiperSlide key={document.id}>
                <Image width={700} height={400} src={document.documentDownloadUrl} alt={document.name} className='w-full h-full' />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      <div className='rounded-full flex border-black border-2 border-solid w-max mt-5 px-2'>
        <button className='p-2 flex items-center gap-1 text-sm' onClick={() => handleReactPost('like')}>
          <ArrowBigUp fill={reacted.type === 'like' ? '' : 'transparent'} /> {reacted.like} likes
        </button>
        <Divider intent={'vertical'} className='bg-black mx-2' />
        <button className='p-2 flex items-center gap-1 text-sm' onClick={() => handleReactPost('dislike')}>
          <ArrowBigDown fill={reacted.type === 'dislike' ? '' : 'transparent'} />
          {reacted.dislike} dislikes
        </button>
      </div>

      <div className='mt-10'>
        <h3 className='font-bold text-xl'>{ideaData.comments.length} Comments</h3>

        <div className='flex gap-3 mt-4'>
          {auth && <AvatarIcon name={auth.staff.name} size='base' />}
          <div className='flex-1'>
            <form
              className='relative w-full mb-5'
              onSubmit={e => {
                e.preventDefault()
                alert('submitted')
              }}
            >
              <textarea className='w-full bg-lightgray border rounded-2xl p-3' rows={7} placeholder='What do you think?' />
              <button type='submit' className='top-5 absolute right-5'>
                <Send />
              </button>

              <div className='flex items-center space-x-2'>
                <Switch id='airplane-mode' />
                <Label htmlFor='airplane-mode'>Comment as anonymous</Label>
              </div>
            </form>

            <div className='flex flex-col gap-3'>
              {ideaData.comments.map(comment => (
                <Comment key={comment.id} {...comment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetail

const Comment = (props: CommentI) => {
  return (
    <div className='w-full bg-lightgray  text-black rounded-lg flex flex-col gap-3 p-4'>
      <div className='flex gap-2 items-center text-sm'>
        <AvatarIcon name={props.staff.name} size='sm' />
        <span>Posted by {props.staff.name} </span>
        <div className='w-1 h-1 bg-black rounded-full' />
        <time>{getDateDistance(props.createdAt)}</time>
      </div>
      <p className='ml-7 text-sm'>{props.content}</p>
    </div>
  )
}
