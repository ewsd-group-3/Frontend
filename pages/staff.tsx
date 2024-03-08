import { z } from 'zod'
import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { departments } from '@/constants/departments'
import { staff } from '@/constants/staffs'

import { useFetch, useMutate } from '@/hooks/useQuery'
import { showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'

import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Poppins } from 'next/font/google'
import { Staff } from '@/types'
import { StaffRes } from '@/types/api'
import { Input } from '@/components/ui/input'

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

export const staffColumns: ColumnDef<Partial<StaffRes>>[] = [
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
    header: () => FilterHeader({ title: 'department' }),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={poppins.className}>
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
  const { data, isLoading } = useFetch<Staff, true>('http://localhost:3000/v1/staffs')
  const staffs = data?.data.staffs ?? []

  const { mutateAsync } = useMutate()

  return (
    <section className="p-5">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Staff</h2>
        <Button
          onClick={() =>
            showDialog({
              title: 'Create department form',
              defaultValues: {
                name: '',
              },
              formSchema,
              children: (
                <div className="mt-5">
                  <Input.Field name="name" label="Department name" />
                </div>
              ),
              cancel: {
                label: 'Cancel',
              },
              action: {
                label: 'Submit',
              },
              onSubmit: async (values) => {
                await mutateAsync({
                  url: 'http://localhost:3000/v1/departments',
                  method: 'POST',
                  payload: {
                    name: values.name,
                  },
                  invalidateUrls: ['http://localhost:3000/v1/staffs'],
                })
              },
            })
          }
        >
          Create
        </Button>
      </div>
      <div className="mt-3">
        <DataTable columns={staffColumns} data={staffs} isLoading={isLoading} />
      </div>
    </section>
  )
}

export default Staff
