import Image from 'next/image'
import SchoolLogo from '@/public/wayne-school-logo.svg'

export default function BrandTitle() {
  return (
    <div className='flex items-center gap-x-4'>
      <Image src={SchoolLogo} className='rounded-full' width={40} height={40} alt='logo' />
      <h1 className='text-white origin-left font-medium text-md'>Wayne School Portal</h1>
    </div>
  )
}
