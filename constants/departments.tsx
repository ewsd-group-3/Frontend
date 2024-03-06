import FilterHeader from '@/components/DataTable/filter-header'
import { Department } from '@/types/department'
import { ColumnDef } from '@tanstack/react-table'
import { Delete, Edit, Trash2 } from 'lucide-react'

export const departments = [
  { name: 'Engineering' },
  { name: 'Marketing' },
  { name: 'Sales' },
  { name: 'Human Resources' },
  { name: 'Finance' },
  { name: 'Accounting' },
  { name: 'Information Technology' },
  { name: 'Customer Service' },
  { name: 'Operations' },
  { name: 'Legal' },
  { name: 'Research & Development' },
  { name: 'Product Management' },
  { name: 'Executive' },
  { name: 'Administration' },
  { name: 'Security' },
  { name: 'Facilities' },
  { name: 'Public Relations' },
  { name: 'Quality Assurance' },
  { name: 'Supply Chain Management' },
  { name: 'Payroll' },
]

export const departmentColumns: ColumnDef<Partial<Department>>[] = [
  {
    accessorKey: 'no',
    header: 'no.',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'name' }),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 gap-2">
          <div>
            <Edit />
          </div>
          <div className="ml-3">
            <Trash2 />
          </div>
        </div>
      )
    },
  },
]
