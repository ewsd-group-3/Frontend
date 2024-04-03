type ChartPercentageCardProps = {
  title: string
  value: number
  color?: string
}

export default function ChartPercentageCard({ title, value, color = 'red' }: ChartPercentageCardProps) {
  return (
    <div className='text-[12px] rounded py-2 px-3 flex items-center gap-2' style={{ border: `2px solid ${color}`, background: `${color}30` }}>
      {title}: <span className='text-[16px] font-semibold'>{value}%</span>
    </div>
  )
}
