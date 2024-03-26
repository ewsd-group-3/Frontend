import { Button } from '@/components/ui/button'
import { ComboBox } from '@/components/ui/combo-box'
import Divider from '@/components/ui/divider'
import FileUploader from '@/components/ui/file-uploader'
import { Form, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Switch, SwitchField } from '@/components/ui/switch'
import { useFetchListing } from '@/hooks/useFetchListing'
import { useMutate } from '@/hooks/useQuery'
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

const IdeaCreate = () => {
  const router = useRouter()
  const { mutateAsync } = useMutate()
  const { startUpload } = useUploadThing('imageUploader')
  const [loading, setLoading] = useState(false)

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

  const { data } = useFetchListing<CategoryRes>('categories?limit=1000')

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

              <div className='flex gap-5 mt-10'>
                <Button type='button' variant={'outline'} className='ml-auto'>
                  Cancel
                </Button>
                <Button type='submit' variant={'default'} disabled={!props.formState.isValid || loading}>
                  {loading && <LoadingSpinner />} <span className='ml-3'> Create</span>
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
