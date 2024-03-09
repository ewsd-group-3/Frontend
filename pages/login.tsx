/* eslint-disable @next/next/no-img-element */
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useMutate } from '@/hooks/useQuery'
import { Vault } from 'lucide-react'
import Image from 'next/image'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
})

const Login = () => {
  const { mutateAsync, isLoading, isSuccess, data, isError, error } = useMutate()
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutateAsync({
      url: `${process.env.BASE_URL}/auth/login`,
      payload: values,
    })
  }

  if (isSuccess) {
    console.log(data, "DATA")
  }

  return (
    <section className="h-screen w-full flex ">
      <div className="h-full bg-accent flex-1">
        <Image
          src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=2001&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt='abstract'
          width={1000}
          height={1000}
          className='h-full w-full bg-cover'
        />
      </div>
      <div className="h-full flex-1 grid place-items-center">
        <div className="w-9/12 max-w-md mx-auto">
          <h2 className="font-bold text-2xl mb-2">Login to Wyne School Portal</h2>
          <small className="text-sm mb-5 block">
            Share ideas, find helpful information, announcements, and collaborate with colleagues.
          </small>
          <div>
            <Form defaultValues={{ email: '', password: '' }} formSchema={formSchema} onSubmit={onSubmit}>
              {({}) => (
                <div className="space-y-4">
                  <Input.Field
                    name="email"
                    label={
                      <>
                        Email Address <span className="text-red-400">*</span>
                      </>
                    }
                    placeholder="user@gmail.com"
                  />
                  <Input.Field
                    name="password"
                    type="password"
                    label={
                      <>
                        Password <span className="text-red-400">*</span>
                      </>
                    }
                    placeholder="********"
                  />
                  <Button type="submit" className="mt-1" disabled={isLoading}>
                    Login
                  </Button>
                  {isError && <p className="text-red-500">{error?.message}</p>}
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
