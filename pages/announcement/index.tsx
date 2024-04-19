import { DataTable } from '@/components/DataTable/data-table'
import FilterHeader from '@/components/DataTable/filter-header'
import { Button } from '@/components/ui/button'
import { useFetchListing } from '@/hooks/useFetchListing'
import { formateDate } from '@/lib/date'
import { showDialog } from '@/lib/utils'
import { Announcement, AnnouncementRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

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
    accessorKey: 'type',
    header: () => FilterHeader({ title: 'type' }),
  },
  {
    accessorKey: 'audiences',
    header: 'Sent To',
    cell: ({ row }) => row.original.audiences?.map(a => a.staff.name).join(', ') ?? '',
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => (
      <div onClick={() => handlePopup(row.original.content)} className='cursor-pointer'>
        {row.original.content!.length > 70 ? row.original.content?.slice(0, 70) + ' ...' : row.original.content}
      </div>
    ),
  },
]

const handlePopup = (content?: string) => {
  showDialog({
    title: 'Announcement Content',
    children: <div className='mt-5 max-h-[60vh] overflow-y-auto'>{content}</div>,
    cancel: true,
    submit: false,
  })
}

export default function AccouncementPage() {
  const { data, isLoading } = useFetchListing<AnnouncementRes>('announcements')
  const accouncements = data?.data?.announcements ?? []

  return (
    <section className='p-2 md:p-5'>
      <div className='flex justify-between'>
        <h2 className='text-xl font-bold'>Accouncements</h2>
        <Link href='/announcement/create'>
          <Button>Create</Button>
        </Link>
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
