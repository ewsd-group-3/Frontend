import AcademicYearForm, { academicYearFormSchema } from '@/components/Form/AcademicYear'
import { CustomBreadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Divider from '@/components/ui/divider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { formateDate } from '@/lib/date'
import { authState } from '@/states/auth'
import { AcademicYearDetail } from '@/types/api'
import { format } from 'date-fns'
import FileSaver from 'file-saver'
import { useRouter } from 'next/router'

import React from 'react'
import { useRecoilState } from 'recoil'
import { z } from 'zod'

const AcademicYearEdit = () => {
  const { mutateAsync } = useMutate()
  const router = useRouter()
  const [auth] = useRecoilState(authState)
  const { data, isLoading } = useFetch<AcademicYearDetail, true>(`academicInfos/${router.query.id}`, {}, { enabled: !!router.query.id })

  const academicYearData = data?.data
  if (isLoading || !academicYearData) return <LoadingSpinner />

  const defaultValues = {
    startDate: new Date(academicYearData.startDate),
    endDate: new Date(academicYearData.endDate),
    firstSemStartDate: new Date(academicYearData.semesters[0].startDate),
    firstSemEndDate: new Date(academicYearData.semesters[0].closureDate),
    firstSemFinalClosureDate: new Date(academicYearData.semesters[0].finalClosureDate),
    secondSemStartDate: new Date(academicYearData.semesters[1].startDate),
    secondSemEndDate: new Date(academicYearData.semesters[1].closureDate),
    secondSemFinalClosureDate: new Date(academicYearData.semesters[1].finalClosureDate),
  }

  const handleEdit = async (values: z.infer<typeof academicYearFormSchema>) => {
    const payload = {
      startDate: values.startDate,
      endDate: values.endDate,
      semesters: [
        {
          id: academicYearData?.semesters[0].id,
          startDate: values.firstSemStartDate,
          closureDate: values.firstSemEndDate,
          finalClosureDate: values.firstSemFinalClosureDate,
        },
        {
          id: academicYearData?.semesters[1].id,
          startDate: values.secondSemStartDate,
          closureDate: values.secondSemEndDate,
          finalClosureDate: values.secondSemFinalClosureDate,
        },
      ],
    }

    const res = await mutateAsync({
      url: `/academicInfos/${router.query.id}`,
      data: payload,
      method: 'patch',
    })

    if (res.statusCode === 200) {
      router.push('/academic-year')
    }
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
      <AcademicYearForm onSubmit={handleEdit} defaultValues={defaultValues} isEdit />
    </div>
  )
}

export default AcademicYearEdit

const DateItem = ({ title, date }: { title: string; date: string }) => {
  return (
    <div className='space-y-2'>
      <h4 className='text-sm'>{title}</h4>
      <p>{formateDate(date)}</p>
    </div>
  )
}
