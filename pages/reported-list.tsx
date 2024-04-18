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
import Link from 'next/link'
import { hideDialog, showDialog } from '@/lib/utils'

const Actions = ({ row }: { row: Row<Report> }) => {
  const isActionTaken = !row.original.isStaffActive || row.original.isIdeaHidden
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

  const handleHidePost = async (ideaId: number, isIdeaHidden: boolean) => {
    try {
      await mutateAsync({
        url: isIdeaHidden ? `ideas/${ideaId}/unhide` : `ideas/${ideaId}/hide`,
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

  const onClickHidePost = async (ideaId: number, isIdeaHidden: boolean) => {
    showDialog({
      title: 'Are you sure to continue?',
      children: (
        <div className='mt-5'>
          <p>This will hide all posts and comments from this user. Please click Yes to confirm.</p>
        </div>
      ),
      cancel: {
        label: 'Cancel',
      },
      action: {
        label: 'Yes',
        onClick: async () => {
          await handleHidePost(ideaId, isIdeaHidden)
          hideDialog()
        },
      },
    })
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

        <DropdownMenuItem onClick={() => onClickHidePost(row.original.ideaId, row.original.isIdeaHidden)}>
          {row.original.isIdeaHidden ? 'Unhide' : 'Hide'} post
        </DropdownMenuItem>

        {!isActionTaken && !row.original.isRejected && <DropdownMenuItem onClick={() => handleRejectPost(row.original.id)}>Reject</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const getReportStatus = ({ isRejected, isIdeaHidden, isStaffActive }: { isRejected?: boolean; isIdeaHidden?: boolean; isStaffActive?: boolean }) => {
  const status = []
  if (isRejected) return 'Rejected'
  if (!!isIdeaHidden) status.push('Hide post')
  if (!isStaffActive) status.push('Deactivated user')
  return status.length === 0 ? '--' : status.join(', ')
}

const reportedListColumns: ColumnDef<Report>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Reported Date',
    cell: ({ row }) => formateDate(row.original.createdAt, 'd MMM y, hh:mm:ss a'),
  },
  {
    accessorKey: 'idea.author.name',
    header: 'Reported To',
  },
  {
    accessorKey: 'idea.title',
    header: 'Post title',
    cell: ({ row }) => <Link href={`/ideas/${row.original?.ideaId}`}>{row.original?.idea?.title}</Link>,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return getReportStatus({
        isRejected: row.original.isRejected,
        isIdeaHidden: row.original.isIdeaHidden,
        isStaffActive: row.original.isStaffActive,
      })
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return row.original.isRejected ? '' : <Actions row={row} />
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
