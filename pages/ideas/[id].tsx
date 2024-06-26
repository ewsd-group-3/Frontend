import ReactHtmlParser from 'react-html-parser'
import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import { ArrowBigDown, ArrowBigUp, ArrowLeft, EyeIcon, Paperclip, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import FullPageLoader from '@/components/shared/full-page-loader'
import Divider from '@/components/ui/divider'
import { Form } from '@/components/ui/form'
import { SwitchField } from '@/components/ui/switch'
import TextArea from '@/components/ui/textarea'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { getIdeaCount } from '@/lib/ideas'
import { cn, getDateDistance, isImage } from '@/lib/utils'
import { authState } from '@/states/auth'
import { CommentI, IdeaDetailI } from '@/types/api'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Pagination } from 'swiper/modules'
import { z } from 'zod'
import useSemester from '@/hooks/useSemester'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { currentSemesterState } from '@/states'

const CategoryChip = ({ name }: { name: string }) => {
  return <div className='px-3 py-1 text-sm rounded-full bg-foreground text-primary-foreground'>{name}</div>
}

type Reacted = {
  like: number
  dislike: number
  type: 'like' | 'dislike' | 'none'
}

const IdeaDetailC = () => {
  const router = useRouter()
  const [auth] = useRecoilState(authState)
  const ideaId = router.query?.id
  const { data, isLoading } = useFetch<IdeaDetailI, true>(`ideas/${ideaId}`, {}, { enabled: !!ideaId })
  const { isBeforeFinalClosureDate } = useSemester()

  const [reacted, setReacted] = useState<Reacted>({
    like: 0,
    dislike: 0,
    type: 'none',
  })
  const ideaData = data?.data
  const currentSem = useRecoilValue(currentSemesterState)
  const isReactionClosed = currentSem?.id !== ideaData?.semesterId || !isBeforeFinalClosureDate()

  const { mutateAsync } = useMutate()

  const { likeCount, dislikeCount } = getIdeaCount(ideaData?.votes ?? [])

  useEffect(() => {
    setReacted({
      like: likeCount,
      dislike: dislikeCount,
      type: ideaData?.likeStatus ?? 'none',
    })
  }, [likeCount, dislikeCount, ideaData?.likeStatus])

  if (isLoading || !ideaData) return <FullPageLoader />

  const handleReactPost = (type: 'like' | 'dislike') => {
    let voteStatus = 'like'

    if (reacted.type === 'none') {
      // Initailly no react
      setReacted({
        ...reacted,
        [type]: reacted[type] + 1,
        type,
      })
      voteStatus = type
    } else {
      // Already having react
      if (reacted.type === type) {
        // Unreact
        setReacted({
          ...reacted,
          [type]: reacted[type] - 1,
          type: 'none',
        })

        voteStatus = type === 'like' ? 'unlike' : 'undislike'
      } else {
        // Change react
        const negatedReact = type === 'like' ? 'dislike' : 'like'
        setReacted({
          ...reacted,
          [type]: reacted[type] + 1,
          [negatedReact]: reacted[negatedReact] - 1,
          type,
        })

        voteStatus = type
      }
    }

    mutateAsync({
      url: '/votes',
      data: {
        voteStatus,
        ideaId,
      },
    })
  }

  const documentImages = ideaData.ideaDocuments.filter(doc => isImage(doc.documentDownloadUrl))
  const documentFiles = ideaData.ideaDocuments.filter(doc => !isImage(doc.documentDownloadUrl))

  return (
    <div className='max-w-3xl p-4'>
      <div className='flex justify-between'>
        <div className='flex flex-wrap gap-2'>
          <button onClick={() => router.push('/')} className='w-10 h-10 bg-primary/10 grid place-items-center rounded-full mr-4'>
            <ArrowLeft />
          </button>
          <div className='flex gap-2 items-center text-sm'>
            <AvatarIcon name={ideaData.isAnonymous ? 'Anonymous' : ideaData.author.name} size='sm' />
            <span>
              Posted by <span className='font-medium'>{ideaData.isAnonymous ? 'Anonymous' : ideaData.author.name}</span>
            </span>
            <div className='w-1 h-1 bg-black rounded-full' />
            <time>{getDateDistance(ideaData.createdAt)}</time>
            <div className='w-1 h-1 bg-black rounded-full' />
            <span className='capitalize font-semibold'>{ideaData.author.department.name}</span>
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

      <article className='mt-3 space-y-1'>{ReactHtmlParser(ideaData.description)}</article>

      <section className='mt-10'>
        {documentImages.length > 0 && (
          <Swiper pagination={true} modules={[Pagination]} className='mySwiper rounded-lg'>
            {documentImages.map(document => (
              <SwiperSlide key={document.id}>
                <Image width={700} height={400} src={document.documentDownloadUrl} alt={document.name} className='w-full h-full' />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className='flex gap-2 flex-col mt-3'>
          {documentFiles.map(file => (
            <a
              key={file.id}
              href={file.documentDownloadUrl}
              target='_blank'
              className='flex gap-2 py-3 px-2 shadow-md items-center text-sm rounded-md '
            >
              <Paperclip className='w-4 h-4' />
              <span className='text-blue-800'>{file.name}</span>
            </a>
          ))}
        </div>
      </section>

      <div className='rounded-full flex border-black border-2 border-solid w-max mt-5 px-2'>
        <button
          disabled={isReactionClosed}
          className={cn('p-2 flex items-center gap-1 text-sm', { 'cursor-not-allowed': isReactionClosed })}
          onClick={() => handleReactPost('like')}
        >
          <ArrowBigUp fill={reacted.type === 'like' ? '' : 'transparent'} /> {reacted.like} likes
        </button>
        <Divider intent={'vertical'} className='bg-black mx-2' />
        <button
          disabled={isReactionClosed}
          className={cn('p-2 flex items-center gap-1 text-sm', { 'cursor-not-allowed': isReactionClosed })}
          onClick={() => handleReactPost('dislike')}
        >
          <ArrowBigDown fill={reacted.type === 'dislike' ? '' : 'transparent'} />
          {reacted.dislike} dislikes
        </button>
      </div>

      <Comment postId={ideaData.semesterId} comments={ideaData.comments} staffName={auth?.staff?.name} />
    </div>
  )
}

export default IdeaDetailC

const commentFormSchema = z.object({
  comment: z.string(),
  isAnonymous: z.boolean(),
})

const Comment = ({ postId, comments, staffName }: { postId: number; comments: IdeaDetailI['comments']; staffName?: string }) => {
  const router = useRouter()
  const ideaId = router.query?.id
  const currentSem = useRecoilValue(currentSemesterState)
  const { mutateAsync, isLoading } = useMutate()
  const { isBeforeFinalClosureDate } = useSemester()
  const isCommentClosed = currentSem?.id !== postId || !isBeforeFinalClosureDate()

  const handleSubmit = async (values: z.infer<typeof commentFormSchema>, reset: (() => void) | undefined) => {
    if (isLoading) return

    const res = await mutateAsync({
      url: 'comments',
      data: {
        content: values.comment,
        ideaId: ideaId,
        isAnonymous: values.isAnonymous,
      },
      invalidateUrls: [`ideas/${router.query.id}`],
    })

    if (res.statusCode === 201) {
      reset && reset()
    }
  }
  return (
    <div className='mt-10'>
      <h3 className='font-bold text-xl'>{comments.length} Comments</h3>

      <div className='flex gap-3 mt-4'>
        {staffName && <AvatarIcon name={staffName} size='base' />}
        <div className='flex-1'>
          <Form
            defaultValues={{
              comment: '',
              isAnonymous: false,
            }}
            formSchema={commentFormSchema}
            onSubmit={handleSubmit}
          >
            <div className='relative w-full mb-3'>
              <TextArea
                disabled={isCommentClosed}
                className={cn('w-full bg-lightgray border rounded-2xl p-3', { 'cursor-not-allowed bg-gray-300': isCommentClosed })}
                rows={7}
                placeholder='What do you think?'
                name='comment'
              />

              <button disabled={isCommentClosed} type='submit' className='top-5 absolute right-5'>
                {isLoading ? <LoadingSpinner /> : <Send />}
              </button>
            </div>

            <SwitchField disabled={isCommentClosed} name='isAnonymous' label='Comment as anonymous' />
          </Form>

          <div className='flex flex-col gap-3 mt-5'>
            {comments.map(comment => (
              <CommentItem key={comment.id} {...comment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CommentItem = (props: CommentI) => {
  return (
    <div className='w-full bg-lightgray  text-black rounded-lg flex flex-col gap-3 p-4'>
      <div className='flex gap-2 items-center text-sm'>
        <AvatarIcon name={props.isAnonymous ? 'Anonymous' : props.staff.name} size='sm' />
        <span>
          Posted by <span className='font-medium'>{props.isAnonymous ? 'Anonymous' : props.staff.name}</span>
        </span>

        <div className='w-1 h-1 bg-black rounded-full' />
        <time>{getDateDistance(props.createdAt)}</time>
      </div>
      <p className='ml-7 text-sm'>{props.content}</p>
    </div>
  )
}
