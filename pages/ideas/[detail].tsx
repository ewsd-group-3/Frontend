import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import { ArrowDown, ArrowLeft, ArrowUp, Divide, EyeIcon, Send } from 'lucide-react'
import React, { useRef, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

const CategoryChip = () => {
  return <div className='px-3 py-1 text-sm rounded-full bg-foreground text-primary-foreground'>Category 1</div>
}

const IdeaDetail = () => {
  const router = useRouter()
  return (
    <div className='max-w-3xl p-4'>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <button onClick={() => router.push('/')} className='w-10 h-10 bg-primary/10 grid place-items-center rounded-full'>
            <ArrowLeft />
          </button>
          <div className='flex gap-2 items-center text-sm'>
            <AvatarIcon name='John Doe' size='sm' />
            <span>Posted by Henry </span>
            <div className='w-1 h-1 bg-black rounded-full' />
            <time>16 hours ago</time>
            <div className='w-1 h-1 bg-black rounded-full' />
            <span>Physics Department</span>
          </div>
        </div>

        <div className='flex gap-1 text-sm items-center'>
          <EyeIcon />
          20
        </div>
      </div>

      <div className='mt-4'>
        <h3 className='my-2 font-semibold text-2xl'>Hello world this is the title</h3>
        <div className='flex gap-2'>
          <CategoryChip />
          <CategoryChip />
        </div>
      </div>

      <article className='mt-3 space-y-1'>
        <p>
          Lorem ipsum dolor sit amet consectetur. Viverra feugiat arcu consequat morbi. Massa laoreet velit in ipsum. Sit et turpis lacus eu blandit
          mus aenean. Mauris facilisis amet porttitor sed etiam tempor lorem platea. Suspendisse commodo sit commodo consectetur leo. Orci cum lectus
          aliquet pellentesque a sollicitudin lacus aliquam.
        </p>
        <p>
          Pellentesque rhoncus non facilisis a vestibulum. Facilisi in non iaculis erat faucibus ullamcorper feugiat etiam. Dictumst interdum ipsum
          vel venenatis viverra. Mauris facilisis amet porttitor sed etiam tempor lorem platea. Suspendisse commodo sit commodo consectetur leo. Orci
          cum lectus aliquet pellentesque a sollicitudin lacus aliquam. Pellentesque rhoncus non facilisis a vestibulum. Facilisi in non iaculis erat
          faucibus ullamcorper feugiat etiam. Dictumst interdum ipsum vel venenatis... See more
        </p>
      </article>

      <section className='mt-10'>
        <Swiper pagination={true} modules={[Pagination]} className='mySwiper rounded-lg'>
          <SwiperSlide>
            <Image
              width={700}
              height={400}
              src='https://images.unsplash.com/photo-1710115929211-ae9646071f6b?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt='Slide 1'
              className='w-full h-full'
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              width={700}
              height={400}
              src='https://images.unsplash.com/photo-1710390916960-3047fcdf561e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt='Slide 1'
              className='w-full h-full'
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              width={700}
              height={400}
              src='https://images.unsplash.com/photo-1710104434425-6ae10f736622?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt='Slide 1'
              className='w-full h-full'
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              width={700}
              height={400}
              src='https://images.unsplash.com/photo-1710678245400-148ffb386d2e?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt='Slide 1'
              className='w-full h-full'
            />
          </SwiperSlide>
        </Swiper>
      </section>

      <div className='rounded-full flex border-black border-2 border-solid w-max mt-5 px-2'>
        <button className='p-2 flex items-center gap-1 text-sm'>
          <ArrowUp /> 23 likes
        </button>
        <Divider intent={'vertical'} className='bg-black mx-2' />
        <button className='p-2 flex items-center gap-1 text-sm'>
          <ArrowDown />
          10 dislikes
        </button>
      </div>

      <div className='mt-10'>
        <h3 className='font-bold text-xl'>3 Comments</h3>

        <div className='flex gap-3 mt-4'>
          <AvatarIcon name='admin' size='base' />
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
              <Comment />
              <Comment />
              <Comment />
              <Comment />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetail

const Comment = () => {
  return (
    <div className='w-full bg-lightgray  text-black rounded-lg flex flex-col gap-3 p-4'>
      <div className='flex gap-2 items-center text-sm'>
        <AvatarIcon name='John Doe' size='sm' />
        <span>Posted by Henry </span>
        <div className='w-1 h-1 bg-black rounded-full' />
        <time>16 hours ago</time>
      </div>
      <p className='ml-7 text-sm'>
        Lorem ipsum dolor sit amet consectetur. Posuere nec ut urna est lorem tellus eget tincidunt. Lorem ipsum dolor sit amet consectetur. Posuere
        nec ut urna est lorem
      </p>
    </div>
  )
}
