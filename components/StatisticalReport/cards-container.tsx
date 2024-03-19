import React from 'react'

export default function CardsContainer({ children, size = 'full', title }: { children: React.ReactNode; size?: 'full' | 'fit'; title: string }) {
  return (
    <div className={`bg-white rounded p-4 ${size === 'fit' ? 'w-fit' : 'w-full'}`}>
      <h3 className='text-sm font-semibold mb-3'>{title}</h3>
      <div className='flex items-center flex-wrap gap-4'>{children}</div>
    </div>
  )
}
