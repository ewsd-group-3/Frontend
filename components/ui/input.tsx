import * as React from 'react'

import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className, type, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className='relative'>
      <input
        type={inputType}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      {type === 'password' && (
        <button type='button' className='absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none' onClick={handleTogglePassword}>
          {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      )}
    </div>
  )
}
Input.displayName = 'Input'

function Field({ ...props }: Partial<InputProps> & { name: string; label: string | React.ReactNode }) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

Input.Field = Field

export { Input }
