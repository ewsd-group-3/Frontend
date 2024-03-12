import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDataTableSorting } from '@/hooks/useDataTableSorting'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import { Department, DepartmentRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useSetRecoilState } from 'recoil'
import { z } from 'zod'

const Actions = ({ row }: any) => {
  const { mutateAsync } = useMutate()
  const setDialogState = useSetRecoilState(dialogState)
  const { mutateAsync: deleteMutateAsync } = useMutate()

  const handleDelete = (id: number) => {
    deleteMutateAsync({
      url: `${process.env.BASE_URL}/departments/${id}`,
      method: 'delete',
      invalidateUrls: [`${process.env.BASE_URL}/departments`],
    }).then(() => {
      setDialogState(undefined)
    })
  }

  return (
    <div className='flex items-center gap-2 space-x-2'>
      <Edit
        className='cursor-pointer'
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
              <div className='mt-5'>
                <Input.Field name='name' label='Department name' />
              </div>
            ),
            cancel: {
              label: 'Cancel',
            },
            action: {
              label: 'Submit',
            },
            onSubmit: values => {
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
              <div className='mt-5'>
                <p>Are you sure you want to delete this department?</p>
              </div>
            ),
            cancel: true,
            action: { label: 'Submit', onClick: () => handleDelete(row.original.id) },
          })
        }
      >
        <Trash2 className='cursor-pointer' size={20} />
      </Button>
    </div>
  )
}

export const departmentColumns: ColumnDef<Partial<Department>>[] = [
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
  const { isSorted } = useDataTableSorting({ sortBy: 'name' })
  const { data, isLoading } = useFetch<DepartmentRes, true>(`${process.env.BASE_URL}/departments?sortBy=name&sortType=${isSorted ?? 'asc'}`)
  const { mutateAsync } = useMutate()
  const departments = data?.data?.departments ?? []
  const setDialog = useSetRecoilState(dialogState)

  return (
    <section className='p-5'>
      <div className='flex justify-between'>
        <h2 className='text-xl font-bold'>Department</h2>
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
                <div className='mt-5'>
                  <Input.Field name='name' label='Department name' />
                </div>
              ),
              cancel: true,
              onSubmit: values => {
                mutateAsync({
                  url: `${process.env.BASE_URL}/departments`,
                  method: 'POST',
                  payload: {
                    name: values.name,
                  },
                  invalidateUrls: [`${process.env.BASE_URL}/departments`],
                }).then(() => setDialog(undefined))
              },
            })
          }
        >
          Create
        </Button>
      </div>
      <div className='mt-3'>
        <DataTable columns={departmentColumns} data={departments} isLoading={isLoading} />
      </div>
    </section>
  )
}

export default DepartmentC
