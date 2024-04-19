interface BrowserInfoProps {
  name: string
  count: number
}

export default function BrowserInfo({ count, name }: BrowserInfoProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='font-medium capitalize'>{name}</div>
      <div className='text-sm font-medium'>{count} logins</div>
    </div>
  )
}
