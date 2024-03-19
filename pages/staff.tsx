import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { SelectField } from '@/components/ui/select'
import { z } from 'zod'

import { useFetch, useMutate } from '@/hooks/useQuery'
import { hideDialog, showDialog } from '@/lib/utils'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DepartmentRes, Staff, StaffDetail, StaffRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import { Poppins } from 'next/font/google'
import { toast } from 'sonner'
import { roles } from '@/constants/staffs'
import { useRouter } from 'next/router'
import DataPagination from '@/components/Pagination/data-pagination'
import { useState } from 'react'
import { useFetchListing } from '@/hooks/useFetchListing'
import { roleStringConvertor } from '@/utils/role-convertor'

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

const StaffAction = ({ row }: any) => {
  const router = useRouter()
  const { mutateAsync } = useMutate()

  const [enabled, setEnabled] = useState(false)
  const { data: departments } = useFetch<DepartmentRes, true>(`departments`, {}, { enabled })
  const { data } = useFetch<StaffDetail, true>(`staffs/${row.original.id}`, {}, { enabled })
  const staffDetail = data?.data?.staff

  const sortBy = (router.query.sortBy || 'id') as string
  const sortType = (router.query.sortType ?? 'asc') as string
  const page = (router.query.page ?? '1') as string

  return (
    <DropdownMenu
      onOpenChange={() => {
        if (!enabled) {
          setEnabled(true)
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreVertical className='h-4 w-4' onClick={() => setEnabled(true)} />
        </Button>
      </DropdownMenuTrigger>
      {enabled && (
        <DropdownMenuContent align='end' className={poppins.className}>
          <DropdownMenuItem
            onClick={() => {
              showDialog({
                title: 'Edit staff',
                defaultValues: {
                  name: staffDetail?.name,
                  email: staffDetail?.email,
                  role: staffDetail?.role,
                  department: staffDetail?.departmentId.toString(),
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
                    url: `staffs/${row.original.id}`,
                    method: 'PATCH',
                    payload: {
                      email: values.email,
                      name: values.name,
                      departmentId: +values.department,
                      role: values.role,
                    },
                    invalidateUrls: ['staffs'],
                  })

                  if (res.statusCode === 200) {
                    hideDialog()
                  }
                },
              })
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>Reset Password</DropdownMenuItem>
          <DropdownMenuItem>Disable User</DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

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
      return <span className='capitalize'>{roleStringConvertor(role!)}</span>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <StaffAction row={row} />,
  },
]

const formSchema = z.object({
  name: z.string().min(1, { message: 'Please fill the department name' }),
  email: z.string().min(1, { message: 'Please fill in email address.' }).email({ message: 'Invalid email address.' }),
  department: z.string(),
  role: z.enum(roles),
})

const Staff = () => {
  const { data: departments } = useFetch<DepartmentRes, true>(`departments`)
  const router = useRouter()
  const { data, isLoading } = useFetchListing<StaffRes>('staffs')
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
                  url: `staffs`,
                  method: 'POST',
                  payload: { email: values.email, name: values.name, departmentId: values.department, role: 'STAFF' },
                  invalidateUrls: [`staffs`],
                })

                if (res.statusCode === 201) {
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
        <DataTable columns={staffColumns} data={staffs} isLoading={isLoading} currentPage={data?.data.page} totalPage={data?.data.totalPages} />
      </div>
    </section>
  )
}

export default Staff
