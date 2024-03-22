type ChartPercentageCardProps = {
  title: string
  value: number
}

export default function ChartPercentageCard({ title, value }: ChartPercentageCardProps) {
  return (
    <div className='text-xs border rounded py-2 px-3 flex items-center gap-2'>
      {title}: <span className='text-lg font-semibold'>{value}%</span>
    </div>
  )
}
