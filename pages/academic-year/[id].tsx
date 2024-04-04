import { CustomBreadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Divider from '@/components/ui/divider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { formateDate } from '@/lib/date'
import { authState } from '@/states/auth'
import { AcademicYearDetail } from '@/types/api'
import FileSaver from 'file-saver'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState } from 'recoil'

const AcademicYearDetail = () => {
  const { mutateAsync } = useMutate()
  const router = useRouter()
  const [auth] = useRecoilState(authState)
  const { data, isLoading } = useFetch<AcademicYearDetail, true>(`academicInfos/${router.query.id}`, {}, { enabled: !!router.query.id })

  const academicYearData = data?.data
  if (isLoading || !academicYearData) return <LoadingSpinner />

  const handleDownloadData = async () => {
    const res = await mutateAsync({
      url: `academicInfos/download/${router.query.id}`,
      responseType: 'arraybuffer',
    })

    // @ts-ignore
    const blob = new Blob([res], { type: 'application/zip' })
    FileSaver.saveAs(blob, `${academicYearData?.name} Year Ideas.zip`)
  }

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
        {auth?.staff.role === 'QA_MANAGER' && <Button onClick={handleDownloadData}>Download Data</Button>}
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
