import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { useFetchListing } from '@/hooks/useFetchListing'
import { useMutate } from '@/hooks/useQuery'
import { formateDate, getAcademicYearStatus } from '@/lib/date'
import { authState } from '@/states/auth'
import { AcademicYearRes, AcademicYearT } from '@/types/api'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState } from 'recoil'

export const academicYearCols: ColumnDef<Partial<AcademicYearT>>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'name' }),
  },
  {
    accessorKey: 'startDate',
    header: () => FilterHeader({ title: 'startDate' }),
    cell: ({ row }) => <p>{formateDate(row.original.startDate)}</p>,
  },
  {
    accessorKey: 'endDate',
    header: () => FilterHeader({ title: 'endDate' }),
    cell: ({ row }) => <p>{formateDate(row.original.endDate)}</p>,
  },
  {
    accessorKey: 'status',
    header: () => FilterHeader({ title: 'status' }),
    cell: ({ row }) => <p>{getAcademicYearStatus(new Date(), row.original.startDate, row.original.endDate)}</p>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <Actions row={row} />,
  },
]

const Actions = ({ row }: any) => {
  const router = useRouter()
  const [auth] = useRecoilState(authState)

  return (
    <DropdownMenu>
      {auth?.staff.role === 'ADMIN' && (
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation()
            router.push(`/academic-year/${row.original.id}/edit`)
          }}
        >
          Update
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const AcademicYear = () => {
  const router = useRouter()
  const [auth] = useRecoilState(authState)
  const { data, isLoading } = useFetchListing<AcademicYearRes>('academicInfos')

  const academicYears = data?.data?.academicInfos ?? []

  return (
    <section className='p-2 md:p-5'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-xl'>Academic Year</h2>
        {auth?.staff.role === 'ADMIN' && <Button onClick={() => router.push('/academic-year/create')}>Create</Button>}
      </div>
      <div className='mt-3'>
        <DataTable
          currentPage={data?.data.page}
          totalPage={data?.data.totalPages}
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
