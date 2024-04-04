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
import { AcademicYearRes, Idea, IdeaRes, SystemReportRes } from '@/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { useClient } from '@/hooks/useQuery'
import { Globe, ScanEye, Users2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  const client = useClient()
  const { data: academicYears } = useFetch<AcademicYearRes, true>(`academicInfos`)
  const [semesterId, setSemesterId] = useState<string | null>(null)
  const [data, setData] = useState<SystemReportRes | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const { data } = await client<SystemReportRes>(`system-reports?semesterId=${semesterId}&page=1&limit=3`)
    console.log(data)
    setData(data)
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
                  <SelectItem key={academicYear.id + '_' + semester.id} value={semester.id.toString()}>
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

      {data && (
        <>
          <div className='grid grid-cols-2 gap-4'>
            <MostUsedContainer icon={{ src: Users2 }} title='Top 3 Active Users' includeIcons>
              {data.topActiveUsers.map((user, index) => (
                <ActiveUserInfo
                  key={index}
                  name={user.staff.name}
                  view={user.viewsCount}
                  comment={user.commentsCount}
                  idea={user.ideasCount}
                  vote={user.votesCount}
                />
              ))}
            </MostUsedContainer>
            <MostUsedContainer icon={{ src: Globe }} title='Top 3 Most used Browsers'>
              {data.mostUsedBrowsers.map((browser, index) => (
                <BrowserInfo name={browser.browserName} key={index} count={browser.totalLogins} />
              ))}
            </MostUsedContainer>
          </div>
          {/* <div className='mt-4'>
            <MostUsedContainer icon={{ src: ScanEye }} title='Most viewed pages (ideas)'>
              <DataTable
                currentPage={ideas?.data.page}
                totalPage={ideas?.data.totalPages}
                columns={ideaColumns}
                data={ideas?.data.ideas ?? []}
                isLoading={isLoading}
              />
            </MostUsedContainer>
          </div> */}
        </>
      )}
    </div>
  )
}
