/* eslint-disable @next/next/no-img-element */
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useEffect } from 'react'
import { detect } from 'detect-browser'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useMutate } from '@/hooks/useQuery'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { authState } from '@/states/auth'
import { LoggedInData } from '@/types/auth'

const formSchema = z.object({
  email: z.string().min(1, { message: 'Please fill in email address.' }).email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Please fill in password.' }),
  browserName: z.string().optional(),
})

const images = [
  [
    'https://images.unsplash.com/photo-1448584109583-8f5fe2e61544?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2626&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  [
    'https://images.unsplash.com/photo-1585763465881-62c5d70627bc?q=80&w=2505&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1629945252011-4d226301d226?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1591710110747-dfeae9fa762a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  [
    'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1555116505-38ab61800975?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
]

const browser = detect()

const ImageContainer = () => {
  return (
    <div className='flex gap-4'>
      {images.map((row, idx) => (
        <div className='flex flex-col gap-4 justify-center' key={idx}>
          {row.map(img => (
            <div key={img} className='w-[100px] h-[120px] md:w-[150px] md:h-[200px] rounded-lg overflow-hidden justify-center'>
              <Image quality={50} width={150} height={200} src={img} alt='univeristy' style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const Login = () => {
  const router = useRouter()
  const [auth, setAuth] = useRecoilState(authState)
  const { mutateAsync, isLoading, isSuccess, data, isError, error } = useMutate<LoggedInData>()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.browserName = browser?.name || 'unknown'
    await mutateAsync({
      url: `auth/login`,
      payload: values,
    })
  }

  useEffect(() => {
    console.log(data, isSuccess)
    if (isSuccess) {
      setAuth({
        staff: data.data.staff,
        tokens: data.data.tokens,
      })
      router.push('/')
    }
  }, [data, isSuccess, router, setAuth])

  return (
    <section className='h-screen w-full grid grid-cols-1 md:grid-cols-2 place-items-center md:px-16 gap-5'>
      <div className='order-2 md:order-1'>
        <ImageContainer />
      </div>

      <div className='h-full w-full grid place-items-center order-1 md:order-2 max-sm:-mt-20'>
        <div className='md:w-9/12 max-w-md mx-auto'>
          <h2 className='font-bold text-2xl mb-2'>Login to Wayne School Portal</h2>
          <small className='text-sm mb-5 block'>Share ideas, find helpful information, announcements, and collaborate with colleagues.</small>
          <div>
            <Form defaultValues={{ email: '', password: '' }} formSchema={formSchema} onSubmit={onSubmit}>
              {({}) => (
                <div className='space-y-4'>
                  <Input.Field
                    name='email'
                    label={
                      <>
                        Email Address <span className='text-red-400'>*</span>
                      </>
                    }
                    placeholder='user@gmail.com'
                  />
                  <Input.Field
                    name='password'
                    type='password'
                    label={
                      <>
                        Password <span className='text-red-400'>*</span>
                      </>
                    }
                    placeholder='********'
                  />
                  <Button type='submit' className='mt-1' disabled={isLoading}>
                    Login
                  </Button>
                  {isError && <p className='text-red-500 text-sm'>{error?.message}</p>}
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
