import CardsContainer from '@/components/StatisticalReport/cards-container'
import StatisticalCard from '@/components/StatisticalReport/statistical-card'
import { Lightbulb, MessageSquare, MessageSquareOff, ThumbsDown, ThumbsUp, Users } from 'lucide-react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import ChartContainer from '@/components/StatisticalReport/chart-container'
import ChartPercentageCard from '@/components/StatisticalReport/chart-percentage-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClient, useFetch } from '@/hooks/useQuery'
import { AcademicYearRes, DepartmentReportRes, DepartmentRes } from '@/types/api'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { colorGenerator } from '@/utils/color-generator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SEMESTER_FILTER } from '@/constants/semester-filter'
import { authState } from '@/states/auth'
import { useRecoilState } from 'recoil'

ChartJS.register()

export default function DepartmentReport() {
  const [auth] = useRecoilState(authState)
  const { data: academicYears } = useFetch<AcademicYearRes, true>(`academicInfos`)
  const { data: departments } = useFetch<DepartmentRes, true>(`all-departments`)
  const [semesterId, setSemesterId] = useState<string | null>(null)
  const [departmentId, setDepartmentId] = useState<string | null>(auth?.staff.role === 'QA_COORDINATOR' ? auth.staff.departmentId.toString() : null)
  const [data, setData] = useState<DepartmentReportRes | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const client = useClient()

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const { data } = await client<DepartmentReportRes>(`/statistical-reports/departments?departmentId=${departmentId}&semesterId=${semesterId}`)

    setData(data)
    setIsLoading(false)
  }

  return (
    <>
      <form className='mb-4 flex flex-wrap items-center gap-4' onSubmit={handleSearch}>
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

        <Select
          onValueChange={id => setDepartmentId(id)}
          defaultValue={auth?.staff.role === 'QA_COORDINATOR' ? auth.staff.departmentId.toString() : undefined}
        >
          <SelectTrigger className='w-[320px]'>
            <SelectValue placeholder='Department' />
          </SelectTrigger>
          <SelectContent>
            {departments && auth?.staff.role === 'QA_COORDINATOR' ? (
              <SelectItem value={auth.staff.departmentId.toString()}>{auth?.staff.department.name}</SelectItem>
            ) : (
              departments?.data.departments.map(department => (
                <SelectItem key={department.id} value={department.id.toString()}>
                  {department.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Button variant='default' disabled={semesterId === null || departmentId === null || isLoading}>
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className='grid place-content-center h-[50vh]'>
          <LoadingSpinner />
        </div>
      ) : (
        data && (
          <>
            <CardsContainer title='Total contributors' size='fit'>
              <StatisticalCard icon={{ src: Lightbulb }} title='Ideas' value={data.ideasCount} />
              <StatisticalCard icon={{ src: MessageSquare }} title='Comments' value={data.commentsCount} />
              <StatisticalCard icon={{ src: ThumbsUp }} title='Up votes' value={data.upVotesCount} />
              <StatisticalCard icon={{ src: ThumbsDown }} title='Down votes' value={data.downVotesCount} />
              <StatisticalCard icon={{ src: Users }} title='Contributors' value={data.contributorsCount} />
            </CardsContainer>
            <div className='mt-4 flex flex-wrap items-center gap-4'>
              <CardsContainer size='fit' title='Anonymous contributors'>
                <StatisticalCard icon={{ src: Lightbulb }} title='Ideas' value={data.anonymousCount} />
                <StatisticalCard icon={{ src: MessageSquare }} title='Comments' value={data.anonymousCmtCount} />
              </CardsContainer>

              <CardsContainer size='fit' title='No comments ideas'>
                <StatisticalCard icon={{ src: MessageSquareOff }} title='Ideas' value={data.noCommentCount} />
              </CardsContainer>
            </div>
            <div className='mt-4 w-full'>
              <ChartContainer title='Ideas by Category'>
                <>
                  <div className='w-full'>
                    <Bar
                      width={100}
                      height={360}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                      data={{
                        labels: data.categoryPercentage.map(category => category.category.name),
                        datasets: [
                          {
                            label: '% of Category',
                            data: data.categoryPercentage.map(category => category.percentage),
                            borderWidth: 2,
                            borderColor: data.categoryPercentage.map(category => colorGenerator(category.category.name)),
                            backgroundColor: data.categoryPercentage.map(category => colorGenerator(category.category.name, 30)),
                          },
                        ],
                      }}
                    />
                  </div>
                  <div className='flex flex-wrap gap-4 items-center'>
                    {data.categoryPercentage.map(category => (
                      <ChartPercentageCard
                        key={category.category.id}
                        title={category.category.name}
                        value={category.percentage}
                        color={colorGenerator(category.category.name)}
                      />
                    ))}
                  </div>
                </>
              </ChartContainer>
            </div>
          </>
        )
      )}
    </>
  )
}
