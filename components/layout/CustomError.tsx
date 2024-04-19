import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/router'

function CustomError() {
  return (
    <div className='flex justify-center items-center h-screen flex-col gap-5'>
      <h1 className='text-5xl'>403 - Forbidden</h1>
      <small>Sorry, the page is forbidden for this user.</small>
      <Button onClick={() => (window.location.href = '/')}>Go back to Home page</Button>
    </div>
  )
}

export default CustomError
