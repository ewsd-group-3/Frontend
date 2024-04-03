import { DataTable } from '@/components/DataTable/data-table'
import ActiveUserInfo from '@/components/SystemReport/ActiveUserInfo'
import BrowserInfo from '@/components/SystemReport/BrowserInfo'
import MostUsedContainer from '@/components/SystemReport/MostUsedContainer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SEMESTER_FILTER } from '@/constants/semester-filter'
import { useFetchListing } from '@/hooks/useFetchListing'
import { useFetch } from '@/hooks/useQuery'
import { AcademicYearRes, Idea, IdeaRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { ArrowUpDown, Eye, Globe, Lightbulb, MessageSquare, ScanEye, Users2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const ideaColumns: ColumnDef<Partial<Idea>>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'ideaCategories',
    header: 'Category',
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-3'>
          {row.original.ideaCategories?.map(category => <Badge key={category.category.id}>{category.category.name}</Badge>) ?? ''}
        </div>
      )
    },
  },
  {
    accessorKey: 'author.name',
    header: 'Author',
  },
  {
    accessorKey: 'id',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <Link href={`ideas/${row.original.id}`}>
          <Button variant='default' size='sm'>
            Details
          </Button>
        </Link>
      )
    },
  },
]

export default function SystemReport() {
  const { data: academicYears } = useFetch<AcademicYearRes, true>(`academicInfos`)
  const [semesterId, setSemesterId] = useState<string | null>(null)
  const [data, setData] = useState<null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data: ideas } = useFetchListing<IdeaRes>('/ideas', {
    sortBy: 'createdAt',
    sortType: 'desc',
    page: '1',
    limit: 5,
  })

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const { data } = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + `/statistical-reports/ideas?semesterId=${semesterId}`)

    setData(data.data)
    setIsLoading(false)
  }

  return (
    <div>
      <h2 className='font-semibold text-xl mb-3'>System Report</h2>
      <form className='mb-4 flex items-center gap-4' onSubmit={handleSearch}>
        <Select onValueChange={id => setSemesterId(id)}>
          <SelectTrigger className='w-[320px]'>
            <SelectValue placeholder='Semester' />
          </SelectTrigger>
          <SelectContent>
            {academicYears?.data.academicInfos.map(academicYear =>
              academicYear.semesters
                .filter(semester => semester.status === SEMESTER_FILTER)
                .map(semester => (
                  <SelectItem key={semester.id} value={semester.id.toString()}>
                    {academicYear.name} [{semester.name}]
                  </SelectItem>
                )),
            )}
          </SelectContent>
        </Select>

        <Button variant='default' disabled={semesterId === null || isLoading}>
          Search
        </Button>
      </form>
      <div className='grid grid-cols-2 gap-4'>
        <MostUsedContainer icon={{ src: Users2 }} title='Top 3 Active Users' includeIcons>
          <ActiveUserInfo name='John Doe' view={20} comment={20} idea={20} vote={20} />
          <ActiveUserInfo name='John Doe' view={20} comment={20} idea={2} vote={20} />
          <ActiveUserInfo name='John Doe' view={20} comment={20} idea={20} vote={20} />
        </MostUsedContainer>
        <MostUsedContainer icon={{ src: Globe }} title='Top 3 Most used Browsers'>
          <BrowserInfo name='Chrome' count={20} />
          <BrowserInfo name='Chrome' count={20} />
          <BrowserInfo name='Chrome' count={20} />
        </MostUsedContainer>
      </div>
      <div className='mt-4'>
        <MostUsedContainer icon={{ src: ScanEye }} title='Most viewed pages (ideas)'>
          <DataTable
            currentPage={ideas?.data.page}
            totalPage={ideas?.data.totalPages}
            columns={ideaColumns}
            data={ideas?.data.ideas ?? []}
            isLoading={isLoading}
          />
        </MostUsedContainer>
      </div>
    </div>
  )
}
