import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cva } from 'class-variance-authority'

interface AvatarIconProps {
  name: string
  size?: 'sm' | 'base' | 'md' | 'lg'
}

export default function AvatarIcon({ name, size = 'sm' }: AvatarIconProps) {
  const profile = cva('profile', {
    variants: {
      size: {
        sm: ['w-6', 'h-6'],
        base: ['w-9', 'h-9'],
        md: ['w-12', 'h-12'],
        lg: ['w-32', 'h-32'],
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  })
  return (
    <Avatar className={profile({ size })}>
      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${name}`} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  )
}
