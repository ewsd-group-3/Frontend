import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Poppins } from 'next/font/google'
import { useFetch } from '@/hooks/useQuery'
import { CategoryRes } from '@/types/api'

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

type Item = {
  value: string | number
  label: string
}

export function ComboBox({
  name,
  label,
  listItems,
  placeholder = 'Please select',
}: {
  name: string
  label: string
  placeholder?: string
  listItems: Item[]
}) {
  const { control, setValue, trigger } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', poppins.className)}>
          <FormLabel>{label}</FormLabel>
          <div className='flex flex-wrap gap-2 text-xs'>
            {field.value.map((v: Item) => (
              <div className='rounded-full px-3 py-1 bg-foreground text-primary-foreground' key={v.value}>
                {v.label}
              </div>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn('w-[200px] justify-between truncate', !field.value && 'text-muted-foreground')}
                >
                  {placeholder}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput placeholder='Search item...' />
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {listItems.map(item => (
                    <CommandItem
                      value={item.label}
                      key={item.value}
                      onSelect={id => {
                        if (field.value.map((item: Item) => item.label.toLowerCase()).includes(id)) {
                          setValue(
                            name,
                            field.value.filter((v: Item) => v.label.toLowerCase() !== id),
                          )
                        } else {
                          setValue(name, [...field.value, item])
                        }
                        trigger(name)
                      }}
                    >
                      <Check
                        className={cn('mr-2 h-4 w-4', field.value.map((i: Item) => i.value).includes(item.value) ? 'opacity-100' : 'opacity-0')}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
