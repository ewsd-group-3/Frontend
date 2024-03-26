import { useCallback, useContext, useState } from 'react'

// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { useDropzone } from '@uploadthing/react'
import { Trash } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { ideaFormSchema } from '@/pages/ideas/create'

export default function FileUploader() {
  const { setValue, watch } = useFormContext<z.infer<typeof ideaFormSchema>>()
  const files = watch('files')

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setValue('files', acceptedFiles)
    },
    [setValue],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  return (
    <div>
      <div className='border !border-dashed py-10 text-center rounded-lg mt-3 cursor-pointer' {...getRootProps()}>
        <input {...getInputProps()} />
        <div>
          <p className='rounded-md py-2 px-2 text-sm' onClick={() => console.log(files)}>
            {files.length > 0 ? `Upload these ${files.length} files` : 'Drop files here!'}
          </p>
        </div>
      </div>

      <div className='space-y-2 mt-3'>
        {files.map((file, idx) => (
          <div key={idx} className='bg-gray-300 flex justify-between  w-full py-2 px-4 text-sm rounded-md'>
            {file.name}
            <Trash
              className='w-4 h-4 cursor-pointer'
              onClick={() => {
                setValue(
                  'files',
                  files.filter(f => f.name !== file.name),
                )
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
