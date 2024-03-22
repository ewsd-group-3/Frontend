import { CustomBreadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Divider from '@/components/ui/divider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useFetch } from '@/hooks/useQuery'
import { formateDate } from '@/lib/date'
import { AcademicYearDetail, IdeaDetail } from '@/types/api'
import { useRouter } from 'next/router'
import React from 'react'

const AcademicYearDetail = () => {
  const router = useRouter()
  const { data, isLoading } = useFetch<IdeaDetail, true>(`ideas/${router.query.id}`, {}, { enabled: !!router.query.id })

  const ideaData = data?.data
  if (isLoading || !ideaData) return <LoadingSpinner />

  console.log(ideaData, 'here')

  return (
    <div className='p-5'>
      <CustomBreadcrumb
        links={[
          {
            label: 'Academic year',
            href: '/academic-year',
          },
          {
            label: academicYearData.name,
          },
        ]}
      />
      <div className='flex justify-between mt-5'>
        <h2 className='font-bold text-3xl mb-10'>{academicYearData.name}</h2>
        <Button onClick={() => alert('download data')}>Download Data</Button>
      </div>

      <div>
        <h4 className='font-bold mb-3 text-lg'>Academic year</h4>
        <div className='flex gap-32'>
          <DateItem title='Start date' date={academicYearData.startDate} />
          <DateItem title='End date' date={academicYearData.endDate} />
        </div>
      </div>
      <Divider />
      <div>
        <h4 className='font-bold mb-3 text-lg'>Semesters</h4>
        {academicYearData.semesters?.map((sem, idx) => (
          <div className='mb-10' key={idx}>
            <h5 className='font-bold mb-2 text-lg'>{sem.name}</h5>
            <div className='flex space-x-32'>
              <DateItem title='Start date' date={sem.startDate} />
              <DateItem title='Closure date' date={sem.closureDate} />
              <DateItem title='Final closure date' date={sem.finalClosureDate} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AcademicYearDetail

const DateItem = ({ title, date }: { title: string; date: string }) => {
  return (
    <div className='space-y-2'>
      <h4 className='text-sm'>{title}</h4>
      <p>{formateDate(date)}</p>
    </div>
  )
}
