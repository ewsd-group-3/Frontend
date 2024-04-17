import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ComboBox } from '@/components/ui/combo-box'
import Divider from '@/components/ui/divider'
import FileUploader from '@/components/ui/file-uploader'
import { Form, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { SwitchField } from '@/components/ui/switch'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { showDialog } from '@/lib/utils'
import { OurFileRouter } from '@/server/uploadthing'
import { CategoryRes } from '@/types/api'
import { generateReactHelpers } from '@uploadthing/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'

export const ideaFormSchema = z.object({
  title: z.string().min(1, { message: 'Please fill title of the post' }),
  content: z.string(),
  category: z.array(
    z.object({
      label: z.string(),
      value: z.string().or(z.number()),
    }),
  ),
  documents: z.array(
    z.object({
      name: z.string(),
      documenttype: z.string(),
      documentDownloadUrl: z.string(),
      documentDeleteUrl: z.string(),
    }),
  ),
  files: z.array(z.instanceof(File)),
  isAnonymous: z.boolean(),
})

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

const handleOpenTnC = () => {
  showDialog({
    title: 'Terms and Conditions',
    children: (
      <div className='mt-5 max-h-[60vh] overflow-y-auto'>
        <h3 className='font-bold'>Terms of Service</h3>
        <p>
          By posting ideas as a staff member of the university, you agree to the following terms of service:
          <ul>
            <li>You are solely responsible for the content of your ideas.</li>
            <li>Your ideas should be respectful, constructive, and relevant to the university community.</li>
            <li>You must not post any confidential or sensitive information.</li>
            <li>The university reserves the right to remove any ideas that violate these terms of service.</li>
          </ul>
        </p>
        <h3 className='font-bold mt-3'>Privacy Policy</h3>
        <p>
          Your privacy is important to us. By posting ideas, you acknowledge and agree to the following privacy policy:
          <ul>
            <li>We may collect and store personal information provided by you, such as your name and email address.</li>
            <li>We may use your personal information to contact you regarding your ideas or for administrative purposes.</li>
            <li>We will not share your personal information with third parties without your consent, unless required by law.</li>
            <li>We may collect and analyze anonymous data to improve our services and enhance the user experience.</li>
          </ul>
        </p>
      </div>
    ),
    cancel: {
      label: 'Close',
    },
    submit: false,
  })
}

const IdeaCreate = () => {
  const router = useRouter()
  const { mutateAsync } = useMutate()
  const { startUpload } = useUploadThing('imageUploader')
  const [loading, setLoading] = useState(false)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

  const onSubmit = async (values: z.infer<typeof ideaFormSchema>) => {
    setLoading(true)
    try {
      const fileRes = await startUpload(values.files)

      const res = await mutateAsync({
        url: 'ideas',
        data: {
          title: values.title,
          description: values.content,
          isAnonymous: values.isAnonymous,
          categoryIds: values.category.map(c => +c.value),
          documents: fileRes?.map(file => ({
            name: file.name,
            documenttype: file.type,
            documentDownloadUrl: file.url,
            documentDeleteUrl: file.url,
          })),
        },
      })
      if (res.statusCode === 201) {
        router.push('/')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const { data } = useFetch<CategoryRes, true>('categories?limit=1000')

  const categoryData = data?.data.categories ?? []

  return (
    <section className='max-w-3xl'>
      <h3 className='font-bold mb-3'>Create an idea</h3>
      <Form
        defaultValues={{ title: '', content: '', isAnonymous: false, category: [], documents: [], files: [] }}
        formSchema={ideaFormSchema}
        onSubmit={onSubmit}
      >
        {props => {
          return (
            <>
              <div className='flex items-center space-x-2 justify-between bg-lightgray py-2 px-4 rounded-lg mb-5'>
                <SwitchField name='isAnonymous' label='Post as anonymous' />
              </div>

              <div className='space-y-5'>
                <Input.Field name='title' label={'Title of your idea'} placeholder='Title for the idea' />
                <Divider />

                <RichTextEditor name='content' label='Idea content' />
                <Divider />

                <ComboBox
                  key={categoryData.length}
                  name='category'
                  label='Idea categories'
                  placeholder='Select categories'
                  listItems={categoryData.map(value => ({
                    label: value.name,
                    value: value.id,
                  }))}
                />
                <Divider />

                <div>
                  <FormLabel>Upload documents</FormLabel>
                  <FileUploader />
                </div>
              </div>
              <Divider />

              <div className='items-top flex space-x-2 mt-8'>
                <Checkbox id='tnc' onCheckedChange={value => setIsCheckboxChecked(value as boolean)} />
                <div className='grid gap-1.5 leading-none'>
                  <label htmlFor='tnc' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Accept terms and conditions.
                  </label>
                  <p className='text-sm text-muted-foreground'>
                    You agree to our{' '}
                    <span className='font-semibold text-primary cursor-pointer' onClick={handleOpenTnC}>
                      Terms of Service and Privacy Policy.
                    </span>
                  </p>
                </div>
              </div>

              <div className='flex gap-5 mt-10'>
                <Button type='button' variant={'outline'} className='ml-auto' disabled={loading} onClick={() => router.push('/')}>
                  Cancel
                </Button>
                <Button type='submit' variant={'default'} disabled={!props.formState.isValid || loading || !isCheckboxChecked}>
                  {loading && (
                    <span className='mr-3'>
                      <LoadingSpinner />
                    </span>
                  )}{' '}
                  Create
                </Button>
              </div>
            </>
          )
        }}
      </Form>
    </section>
  )
}

export default IdeaCreate
