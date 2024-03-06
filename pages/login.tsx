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

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(32, { message: 'Password must be less than 33 characters.' })
    .trim() // Removes leading and trailing whitespace
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
})

const Login = () => {
  const { mutateAsync } = useMutate()
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, 'from onSubmit')
    mutateAsync({
      url: 'be api',
      payload: values,
    })
  }

  return (
    <section className="h-screen w-full flex ">
      <div className="h-full bg-accent flex-1">
        <img
          className="h-full w-full bg-cover"
          src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=2001&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="abstract"
        />
      </div>
      <div className="h-full flex-1 grid place-items-center">
        <div className="w-9/12 max-w-md mx-auto">
          <h2 className="font-bold text-2xl mb-2">Login to School Portal</h2>
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
                  />
                  <Button type="submit" className="mt-1">
                    Login
                  </Button>
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
