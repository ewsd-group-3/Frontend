import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

import { useFetch, useMutate } from '@/hooks/useQuery'
import { showDialog } from '@/lib/utils'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Staff, StaffRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import { Poppins } from 'next/font/google'
import { useDataTableSorting } from '@/hooks/useDataTableSorting'
import { useRouter } from 'next/router'

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

export const staffColumns: ColumnDef<Partial<Staff>>[] = [
  {
    accessorKey: 'id',
    header: 'no.',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'name' }),
  },

  {
    accessorKey: 'email',
    header: () => FilterHeader({ title: 'email' }),
  },
  {
    accessorKey: 'department.name',
    header: () => 'Department',
  },
  {
    accessorKey: 'role',
    header: () => FilterHeader({ title: 'role' }),
    cell: ({ row }) => {
      const role = row.original.role
      return <span className='capitalize'>{role?.toLocaleLowerCase().split('_').join(' ')}</span>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className={poppins.className}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Reset Password</DropdownMenuItem>
            <DropdownMenuItem>Disable User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const formSchema = z.object({
  name: z.string(),
})

const Staff = () => {
  const router = useRouter()
  // const { isSorted } = useDataTableSorting({ sortBy: String(router.query.sortBy) })
  const { data, isLoading } = useFetch<StaffRes, true>(
    `${process.env.BASE_URL}/staffs?sortBy=${router.query.sortBy || 'id'}&sortType=${router.query.sortType ?? 'asc'}`,
  )
  const staffs = data?.data?.staffs ?? []

  const { mutateAsync } = useMutate()

  return (
    <section className='p-5'>
      <div className='flex justify-between'>
        <h2 className='text-xl font-bold'>Staff</h2>
        <Button
          onClick={() =>
            showDialog({
              title: 'Create staff form',
              defaultValues: {
                name: '',
              },
              formSchema,
              children: (
                <div className='mt-5'>
                  <Input.Field name='name' label='Department name' />
                </div>
              ),
              cancel: true,
              onSubmit: async values => {
                await mutateAsync({
                  url: `${process.env.BASE_URL}/staffs`,
                  method: 'POST',
                  payload: {
                    name: values.name,
                  },
                  invalidateUrls: [`${process.env.BASE_URL}/staffs`],
                })
              },
            })
          }
        >
          Create
        </Button>
      </div>
      <div className='mt-3'>
        <DataTable columns={staffColumns} data={staffs} isLoading={isLoading} />
      </div>
    </section>
  )
}

export default Staff
