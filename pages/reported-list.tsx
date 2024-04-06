import FilterHeader from '@/components/DataTable/filter-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMutate } from '@/hooks/useQuery'
import { showDialog, hideDialog } from '@/lib/utils'
import { ReportRes, Report } from '@/types/api'
import { ColumnDef, Row } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFetchListing } from '@/hooks/useFetchListing'
import { DataTable } from '@/components/DataTable/data-table'
import { formateDate } from '@/lib/date'
import { toast } from 'sonner'

const Actions = ({ row }: { row: Row<Partial<Report>> }) => {
  const { mutateAsync } = useMutate()

  const handleDeactivateUser = async (authorId?: number) => {}

  const handleHidePost = async (ideaId?: number) => {}

  const handleRejectPost = async (reportId?: number) => {
    alert(reportId)
    // try {
    //   await mutateAsync({
    //     url: `reports/${reportId}/reject`,
    //     method: 'PATCH',
    //     invalidateUrls: [`reports`],
    //   })
    // } catch (error: any) {
    //   console.error(error)
    //   toast.error(error.message)
    // }
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
        <DropdownMenuItem onClick={() => handleDeactivateUser(row.original.idea?.authorId)}>Deactivate user</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleHidePost(row.original.ideaId)}>Hide post</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRejectPost(row.original.id)}>Reject</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const reportedListColumns: ColumnDef<Partial<Report>>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formateDate(row.original.createdAt, 'd MMM y, hh:mm:ss a'),
  },
  {
    accessorKey: 'idea.author.name',
    header: () => FilterHeader({ title: 'name' }),
  },
  {
    accessorKey: 'idea.title',
    header: 'Post',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <Actions row={row} />,
  },
]

export default function ReportedListPage() {
  const { data, isLoading } = useFetchListing<ReportRes>('reports')

  return (
    <section className='p-5'>
      <h2 className='text-xl font-bold'>Reported List</h2>
      <div className='mt-6'>
        <DataTable
          currentPage={data?.data.page}
          totalPage={data?.data.totalPages}
          columns={reportedListColumns}
          data={data?.data.reports ?? []}
          isLoading={isLoading}
        />
      </div>
    </section>
  )
}
