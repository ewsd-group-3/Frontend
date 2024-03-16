import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { formateDate, getAcademicYearStatus } from '@/lib/date'
import { showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import { AcademicYearRes, AcademicYearT } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { z } from 'zod'

export const academicYearCols: ColumnDef<Partial<AcademicYearT>>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'Name' }),
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => <p>{formateDate(row.original.startDate)}</p>,
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => <p>{formateDate(row.original.endDate)}</p>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <p>{getAcademicYearStatus(new Date(), row.original.startDate, row.original.endDate)}</p>,
  },
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => <Actions row={row} />,
  // },
]

const AcademicYear = () => {
  const router = useRouter()
  const { mutateAsync } = useMutate()
  const setDialog = useSetRecoilState(dialogState)

  const { data, isLoading } = useFetch<AcademicYearRes, true>(`${process.env.BASE_URL}/academicInfos`)

  const academicYears = data?.data?.academicInfos ?? []

  return (
    <section className='p-5'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-xl'>Academic Year</h2>
        <Button onClick={() => router.push('/academic-year/create')}>Create</Button>
      </div>
      <div className='mt-3'>
        <DataTable
          columns={academicYearCols}
          data={academicYears}
          isLoading={isLoading}
          onClickRow={(id: string) => router.push(`/academic-year/${id}`)}
        />
      </div>
    </section>
  )
}

export default AcademicYear
