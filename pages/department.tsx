import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { departments } from '@/constants/departments'
import { showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import { Department } from '@/types/department'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { z } from 'zod'

export const departmentColumns: ColumnDef<Partial<Department>>[] = [
  {
    accessorKey: 'no',
    header: 'no.',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'name' }),
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: 'Actions',
    cell: () => {
      return (
        <div className="flex space-x-2 gap-2 items-center">
          <Edit size={20} />
          <Trash2 size={20} />
        </div>
      )
    },
  },
]

const DepartmentC = () => {
  const dialog = useRecoilValue(dialogState)
  const transformedData = departments.map((depart, idx) => ({
    no: idx + 1,
    ...depart,
  }))

  return (
    <section className="p-5">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Department</h2>
        <Button
          onClick={() =>
            showDialog({
              title: 'Create department',
              defaultValues: {
                name: '',
              },
              formSchema: z.object({
                name: z.string().min(5, { message: 'Must be 5 or more characters long' }),
              }),
              children: (
                <div className="mt-5">
                  <Input.Field name="name" label="Name" />
                </div>
              ),
            })
          }
        >
          Create
        </Button>
      </div>
      <div className="mt-3">
        <DataTable columns={departmentColumns} data={transformedData} />
      </div>
    </section>
  )
}

export default DepartmentC
