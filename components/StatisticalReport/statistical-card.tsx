import { LucideIcon } from 'lucide-react'

type StatisticalCardProps = {
  title: string
  value: number
  icon: {
    src: LucideIcon
  }
}

export default function StatisticalCard({ icon, title, value }: StatisticalCardProps) {
  return (
    <div className='bg-background rounded flex items-center gap-5 py-3 px-5 shadow-sm'>
      <div className='w-14 h-14 bg-primary rounded-full bg-white text-primary p-2 grid place-content-center'>
        <icon.src size={26} />
      </div>
      <div className='flex flex-col'>
        <h3 className='text-sm font-medium'>{title}</h3>
        <p className='text-xl font-semibold'>{value}</p>
      </div>
    </div>
  )
}
