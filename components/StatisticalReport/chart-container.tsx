export default function ChartContainer({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className={`bg-white rounded p-4 w-full`}>
      <h3 className='text-sm font-semibold mb-3'>{title}</h3>
      <div className='grid grid-cols-1 gap-4 w-full'>{children}</div>
    </div>
  )
}
