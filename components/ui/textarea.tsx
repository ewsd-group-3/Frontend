import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from 'postcss'
import { TextareaHTMLAttributes } from 'react'

type TextAreaType = {
  name: string
  label?: string
}

const TextArea = ({ name, label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & TextAreaType) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <textarea {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TextArea
