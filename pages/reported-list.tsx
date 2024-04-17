import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMutate } from '@/hooks/useQuery'
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

  const handleToggleUser = async (authorId?: number) => {
    try {
      await mutateAsync({
        url: `staffs/toggle-active/${authorId}`,
        method: 'PATCH',
        invalidateUrls: [`reports`],
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const handleHidePost = async (ideaId?: number) => {
    try {
      await mutateAsync({
        url: `ideas/${ideaId}/hide`,
        method: 'PATCH',
        invalidateUrls: [`reports`],
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const handleUnhidePost = async (ideaId?: number) => {
    try {
      await mutateAsync({
        url: `ideas/${ideaId}/unhide`,
        method: 'PATCH',
        invalidateUrls: [`reports`],
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const handleRejectPost = async (reportId?: number) => {
    try {
      await mutateAsync({
        url: `reports/${reportId}/reject`,
        method: 'PATCH',
        invalidateUrls: [`reports`],
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
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
        <DropdownMenuItem onClick={() => handleToggleUser(row.original.idea?.authorId)}>
          {row.original.isStaffActive ? 'Deactivate' : 'Activate'} User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => (row.original.isIdeaHidden ? handleUnhidePost(row.original.ideaId) : handleHidePost(row.original.ideaId))}>
          {row.original.isIdeaHidden ? 'UnHide' : 'Hide'} post
        </DropdownMenuItem>
        <DropdownMenuItem disabled={row.original.isRejected} onClick={() => handleRejectPost(row.original.id)}>
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const reportedListColumns: ColumnDef<Partial<Report>>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Reported Date',
    cell: ({ row }) => formateDate(row.original.createdAt, 'd MMM y, hh:mm:ss a'),
  },
  {
    accessorKey: 'idea.author.name',
    header: 'Reported Name',
  },
  {
    accessorKey: 'idea.title',
    header: 'Post',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return row.original.isRejected ? 'Rejected' : <Actions row={row} />
    },
  },
]

export default function ReportedListPage() {
  const { data, isLoading } = useFetchListing<ReportRes>('reports', {
    sortBy: 'createdAt',
    sortType: 'desc',
    page: '1',
    limit: 5,
  })
  console.log(data)

  return (
    <section className='p-2 md:p-5'>
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
