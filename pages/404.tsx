import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Custom404 = () => {
  return (
    <div className='flex justify-center items-center h-screen flex-col gap-5'>
      <h1 className='text-5xl'>404 - Page Not Found</h1>
      <small>Sorry, the page you are looking for does not exist.</small>
      <Link className='mt-4' href={'/'}>
        <Button>Go back to Home page</Button>
      </Link>
    </div>
  )
}

export default Custom404
