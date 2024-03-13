import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { SelectField } from '@/components/ui/select'
import { z } from 'zod'

import { useFetch, useMutate } from '@/hooks/useQuery'
import { hideDialog, showDialog } from '@/lib/utils'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DepartmentRes, Staff, StaffRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import { Poppins } from 'next/font/google'
import { toast } from 'sonner'
import { roles } from '@/constants/staffs'
import { useDataTableSorting } from '@/hooks/useDataTableSorting'
import { useRouter } from 'next/router'
import DataPagination from '@/components/Pagination/data-pagination'

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
    header: 'Id',
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
  name: z.string().min(1, { message: 'Please fill the department name' }),
  email: z.string().min(1, { message: 'Please fill in email address.' }).email({ message: 'Invalid email address.' }),
  department: z.string(),
})

const Staff = () => {
  const { data: departments, isLoading: departmentLoading } = useFetch<DepartmentRes, true>(`${process.env.BASE_URL}/departments`)
  const router = useRouter()
  // const { isSorted } = useDataTableSorting({ sortBy: String(router.query.sortBy) })
  const { data, isLoading } = useFetch<StaffRes, true>(
    `${process.env.BASE_URL}/staffs?sortBy=${router.query.sortBy || 'id'}&sortType=${router.query.sortType ?? 'asc'}&page=${router.query.page ?? 1}`,
  )
  const staffs = data?.data?.staffs ?? []
  console.log(data)

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
                email: '',
                department: '1',
              },
              formSchema,
              children: (
                <div>
                  <div className='mt-5'>
                    <Input.Field name='name' label='Name' placeholder='John Doe' />
                  </div>

                  <div className='mt-5'>
                    <Input.Field name='email' label='Email' type='email' placeholder='example@gre.uk' />
                  </div>

                  <div className='mt-5'>
                    <SelectField items={roles.map(role => ({ label: role, value: role }))} name='role' label='Role' placeholder='Select a role' />
                  </div>

                  <div className='mt-5'>
                    <SelectField
                      items={
                        departments
                          ? departments?.data.departments.map(d => ({
                              label: d.name,
                              value: d.id,
                            }))
                          : []
                      }
                      name='department'
                      label='Department'
                      placeholder='Select a department'
                    />
                  </div>
                </div>
              ),
              cancel: true,
              onSubmit: async values => {
                const res = await mutateAsync({
                  url: `${process.env.BASE_URL}/staffs`,
                  method: 'POST',
                  payload: { email: values.email, name: values.name, departmentId: values.department, role: 'STAFF' },
                  invalidateUrls: [`${process.env.BASE_URL}/staffs`],
                })

                if (res.statusCode === 201) {
                  toast('Created staff successfully')
                  hideDialog()
                }
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
      {data && (
        <div className='mt-3'>
          <DataPagination currentPage={data?.data.page} totalPage={data?.data.totalPages} />
        </div>
      )}
    </section>
  )
}

export default Staff
