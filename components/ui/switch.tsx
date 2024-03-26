import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'
import { FormControl, FormField, FormItem, FormLabel } from './form'
import { useFormContext } from 'react-hook-form'

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitives.Root>
  ),
)
Switch.displayName = SwitchPrimitives.Root.displayName

const SwitchField = ({ name, label }: Partial<React.ElementRef<typeof SwitchPrimitives.Root>> & { name: string; label: string }) => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex items-center space-x-2 text-sm'>
          <FormLabel className='text-sm'>{label}</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly className='!my-0' />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export { Switch, SwitchField }
