import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Label } from './label'

const DatePicker = ({
  label,
  name,
  minDate = new Date('2010-01-01'),
  maxDate = new Date('2040-01-01'),
  disabled,
}: {
  label: string
  name: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}) => {
  const { watch, setValue } = useFormContext()
  const date = watch(name)

  return (
    <div className='flex flex-col space-y-2'>
      <Label className='text-xs'>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant={'outline'}
            className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground', disabled && 'cursor-not-allowed')}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={date}
            defaultMonth={typeof minDate === 'object' && minDate.getFullYear() === 2010 ? new Date() : minDate}
            disabled={date => date > maxDate || date < minDate}
            onSelect={date => {
              setValue(name, date)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePicker
