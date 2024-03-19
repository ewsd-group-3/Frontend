import { Button } from '@/components/ui/button'
import Divider from '@/components/ui/divider'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import React from 'react'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().min(1, { message: 'Please fill in email address.' }).email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Please fill in password.' }),
})

const create = () => {
  const onSubmit = () => {}

  return (
    <section className='max-w-3xl'>
      <h3 className='font-bold mb-3'>Create an idea</h3>
      <Form defaultValues={{ email: '', password: '' }} formSchema={formSchema} onSubmit={onSubmit}>
        <div className='flex items-center space-x-2 justify-between bg-lightgray py-2 px-4 rounded-lg mb-5'>
          <Label htmlFor='airplane-mode'>Post as anonymous</Label>
          <Switch id='airplane-mode' />
        </div>

        <div className='space-y-5'>
          <Input.Field name='email' label={'Title of your idea'} placeholder='user@gmail.com' />

          <Divider />
          <Input.Field name='email' label={'Idea content'} placeholder='user@gmail.com' />

          <Divider />
          <Input.Field name='email' label={'Category'} placeholder='user@gmail.com' />

          <Divider />
          <Input.Field name='email' label={'Upload documents'} placeholder='user@gmail.com' />
        </div>

        <div className='flex gap-5 mt-10'>
          <Button variant={'outline'} className='ml-auto'>
            Cancel
          </Button>
          <Button variant={'default'}>Submit</Button>
        </div>
      </Form>
    </section>
  )
}

export default create
