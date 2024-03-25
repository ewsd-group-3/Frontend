import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function FullPageLoader() {
  return (
    <div className='w-100 h-screen grid place-content-center'>
      <LoadingSpinner />
    </div>
  )
}
