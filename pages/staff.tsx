import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { departments } from '@/constants/departments'
import { staff } from '@/constants/staffs'

import { useFetch } from '@/hooks/useQuery'
import { showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import { Staff } from '@/types'
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

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

export const staffColumns: ColumnDef<Partial<Staff>>[] = [
  {
    accessorKey: 'no',
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
    accessorKey: 'department',
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
const Staff = () => {
  const dialog = useRecoilValue(dialogState)
  // const { showDialog } = useDialog()

  const transformedData = staff.map((s, idx) => ({
    no: idx + 1,
    ...s,
  }))

  return (
    <section className="p-5">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Staff</h2>
        <Button
          onClick={() =>
            showDialog({
              title: 'Create department form',
              description: 'This is the description of the dialog',
              children: (
                <div className="mt-5">
                  <p>Testing the children</p>
                  <Button>Click here for button</Button>
                </div>
              ),
            })
          }
        >
          Create
        </Button>
      </div>
      <div className="mt-3">
        <DataTable columns={staffColumns} data={transformedData} />
      </div>
    </section>
  )
}

export default Staff
