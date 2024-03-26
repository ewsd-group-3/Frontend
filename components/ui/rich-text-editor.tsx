import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { ReactQuillProps } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import dynamic from 'next/dynamic'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

const RichTextEditor = ({ name, label, ...props }: ReactQuillProps & { name: string; label: string }) => {
  const { setValue, watch } = useFormContext()
  const value = watch(name)

  return (
    <div className='w-full !mb-16'>
      <FormLabel>{label}</FormLabel>
      <ReactQuill
        value={value}
        theme='snow'
        placeholder="What's your idea"
        className={cn(poppins.className, 'h-72')}
        onChange={value => {
          setValue(name, value)
        }}
        {...props}
      />
    </div>
  )
}

export default RichTextEditor
