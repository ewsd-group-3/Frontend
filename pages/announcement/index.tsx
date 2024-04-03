import { DataTable } from '@/components/DataTable/data-table'
import { Button } from '@/components/ui/button'
import { useFetchListing } from '@/hooks/useFetchListing'
import { formateDate } from '@/lib/date'
import { Announcement, AnnouncementRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'

const accouncementColumns: ColumnDef<Partial<Announcement>>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'createdAt',
    header: 'Announced At',
    cell: ({ row }) => formateDate(row.original.createdAt, 'd MMM y, hh:mm:ss a'),
  },
  {
    accessorKey: 'audiences',
    header: 'Sent To',
    cell: ({ row }) => row.original.audiences?.map(a => a.staffId).join(', ') ?? '',
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
  },
  {
    accessorKey: 'content',
    header: 'Content',
  },
]

export default function AccouncementPage() {
  const { data, isLoading } = useFetchListing<AnnouncementRes>('announcements')
  const accouncements = data?.data?.announcements ?? []

  return (
    <section className='p-5'>
      <div className='flex justify-between'>
        <h2 className='text-xl font-bold'>Accouncements</h2>
        <Button>Create</Button>
      </div>
      <div className='mt-3'>
        <DataTable
          currentPage={data?.data?.page}
          totalPage={data?.data?.totalPages}
          columns={accouncementColumns}
          data={accouncements}
          isLoading={isLoading}
        />
      </div>
    </section>
  )
}
