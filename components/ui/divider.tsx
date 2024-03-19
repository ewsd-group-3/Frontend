import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const divider = cva(['bg-gray-400'], {
  variants: {
    intent: {
      horizontal: ['w-full my-4 h-0.5 '],
      vertical: ['h-auto border-none w-0.5'],
    },
  },
  defaultVariants: {
    intent: 'horizontal',
  },
})

export interface HTMLHRProps extends React.HTMLAttributes<HTMLHRElement>, VariantProps<typeof divider> {}

const Divider: React.FC<HTMLHRProps> = ({ className, intent, ...props }) => {
  return <hr className={cn(divider({ intent, className }), { ...props })} />
}

export default Divider
