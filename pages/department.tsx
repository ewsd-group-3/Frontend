import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { hideDialog, showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import { Department, DepartmentRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'
import { useSetRecoilState } from 'recoil'
import { z } from 'zod'
import { toast } from 'sonner'

const Actions = ({ row }: any) => {
  const { mutateAsync } = useMutate()
  const setDialogState = useSetRecoilState(dialogState)
  const { mutateAsync: deleteMutateAsync } = useMutate()

  const handleUpdate = (value: any) => {
    showDialog({
      title: 'Update department form',
      defaultValues: value,
      formSchema: z.object({
        name: z.string().min(1, { message: 'Department name is required.' }),
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
      onSubmit: async values => {
        const res = await mutateAsync({
          url: `${process.env.BASE_URL}/departments/${row.original.id}`,
          method: 'PATCH',
          payload: {
            name: values.name,
          },
          invalidateUrls: [`${process.env.BASE_URL}/departments`],
        })

        if (res.statusCode === 200) {
          hideDialog()
        }
      },
    })
  }

  const handleDelete = async (id: number) => {
    // TODO: ask BE to give the message
    const res = await deleteMutateAsync({
      url: `${process.env.BASE_URL}/departments/${id}`,
      method: 'delete',
      invalidateUrls: [`${process.env.BASE_URL}/departments`],
    })

    toast('Deleted department successfully.')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => handleUpdate({ name: row.original.name })}>Update</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const departmentColumns: ColumnDef<Partial<Department>>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'name' }),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <Actions row={row} />,
  },
]

const DepartmentC = () => {
  const { data, isLoading } = useFetch<DepartmentRes, true>(`${process.env.BASE_URL}/departments`)
  const { mutateAsync } = useMutate()
  const departments = data?.data?.departments ?? []
  const setDialog = useSetRecoilState(dialogState)

  return (
    <section className='p-5'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-xl'>Department</h2>
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
