import { ArrowUpDown, Eye, Lightbulb, LucideIcon, MessageSquare } from 'lucide-react'

interface TopThreeContainerProps {
  icon: {
    src: LucideIcon
  }
  title: string
  children: React.ReactNode
  includeIcons?: boolean
}

export default function TopThreeContainer({ icon, title, children, includeIcons = false }: TopThreeContainerProps) {
  return (
    <div className='bg-white rounded p-4'>
      <div className='grid grid-cols-2 mb-5'>
        <div className='flex items-center gap-3'>
          <span>
            <icon.src />
          </span>
          <span className='font-medium'>{title}</span>
        </div>
        {includeIcons && (
          <div className='flex items-center justify-end gap-5'>
            <Eye />
            <ArrowUpDown />
            <MessageSquare />
            <Lightbulb />
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 w-full gap-5'>{children}</div>
    </div>
  )
}
