import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { departments } from '@/constants/departments'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import { Department } from '@/types'
import { DepartmentRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { z } from 'zod'

const Actions = ({ row }: any) => {
  const { mutateAsync } = useMutate()
  const { mutateAsync: deleteMutateAsync } = useMutate()

  const handleDelete = (id: number) => {
    deleteMutateAsync({
      url: `${process.env.BASE_URL}/departments/${id}`,
      method: 'delete',
      invalidateUrls: [`${process.env.BASE_URL}/departments`],
    })
  }

  return (
    <div className="flex space-x-2 gap-2 items-center">
      <Edit 
        className="cursor-pointer" 
        size={20}
         onClick={() =>
            showDialog({
              title: 'Update department form',
              defaultValues: {
                name: '',
              },
              formSchema: z.object({
                name: z.string().min(5, { message: 'Must be 5 or more characters long' }),
              }),
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
              onSubmit: (values) => {
                mutateAsync({
                  url: `${process.env.BASE_URL}/departments/${row.original.id}`,
                  method: 'PATCH',
                  payload: {
                    name: values.name,
                  },
                  invalidateUrls: [`${process.env.BASE_URL}/departments`],
                })
              },
            })
          } 
      />
      <Button  
        onClick={() =>
          showDialog({
            title: 'Confirmation box',
            children: (
              <div className="mt-5">
                <p>Are you sure you want to delete this department?</p>
              </div>
            ),
            cancel: {
              label: 'Cancel',
            },
            action: {
              label: 'Submit',
            },
            onSubmit: () => {
              handleDelete(row.original.id)
            },
          })
        }>
        <Trash2 className="cursor-pointer" size={20} />
      </Button>
    </div>
  )
}

export const departmentColumns: ColumnDef<Partial<DepartmentRes>>[] = [
  {
    accessorKey: 'id',
    header: 'no.',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'name' }),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <Actions row={row} />,
  },
]

const DepartmentC = () => {
  const { data, isLoading } = useFetch<Department, true>(`${process.env.BASE_URL}/departments`)
  const { mutateAsync } = useMutate()
  const departments = data?.data?.departments ?? []

  return (
    <section className="p-5">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Department</h2>
        <Button
          onClick={() =>
            showDialog({
              title: 'Create department form',
              defaultValues: {
                name: '',
              },
              formSchema: z.object({
                name: z.string().min(5, { message: 'Must be 5 or more characters long' }),
              }),
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
              onSubmit: (values) => {
                mutateAsync({
                  url: `${process.env.BASE_URL}/departments`,
                  method: 'POST',
                  payload: {
                    name: values.name,
                  },
                  invalidateUrls: [`${process.env.BASE_URL}/departments`],
                })
              },
            })
          }
        >
          Create
        </Button>
      </div>
      <div className="mt-3">
        <DataTable columns={departmentColumns} data={departments} isLoading={isLoading} />
      </div>
    </section>
  )
}

export default DepartmentC
