import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import DataPagination from '@/components/Pagination/data-pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDataTableSorting } from '@/hooks/useDataTableSorting'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { hideDialog, showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import { Department, DepartmentRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'
import { useSetRecoilState } from 'recoil'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { useFetchListing } from '@/hooks/useFetchListing'

const Actions = ({ row }: any) => {
  const { mutateAsync } = useMutate()
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
          url: `departments/${row.original.id}`,
          method: 'PATCH',
          payload: {
            name: values.name,
          },
          invalidateUrls: [`departments`],
        })

        if (res.statusCode === 200) {
          hideDialog()
        }
      },
    })
  }

  const handleDelete = async (id: number) => {
    // TODO: ask BE to give the message
    try {
      const res = await deleteMutateAsync({
        url: `departments/${id}`,
        method: 'delete',
        invalidateUrls: [`departments`],
      })

      // toast.success('Deleted department successfully.')
    } catch (err: any) {
      toast.error(err.message, {})
    }
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

const departmentColumns: ColumnDef<Partial<Department>>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: () => FilterHeader({ title: 'name' }),
  },
  {
    accessorKey: '_count.staffs',
    header: 'Staff Count',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <Actions row={row} />,
  },
]

const DepartmentC = () => {
  const router = useRouter()
  const { isSorted } = useDataTableSorting({ sortBy: 'name' })
  const { data, isLoading } = useFetchListing<DepartmentRes>('departments')
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
                  url: `departments`,
                  method: 'POST',
                  payload: {
                    name: values.name,
                  },
                  invalidateUrls: [`departments`],
                }).then(() => setDialog(undefined))
              },
            })
          }
        >
          Create
        </Button>
      </div>
      <div className='mt-3'>
        <DataTable
          currentPage={data?.data.page}
          totalPage={data?.data.totalPages}
          columns={departmentColumns}
          data={departments}
          isLoading={isLoading}
        />
      </div>
    </section>
  )
}

export default DepartmentC
