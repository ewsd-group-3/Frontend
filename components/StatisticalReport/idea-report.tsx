import CardsContainer from '@/components/StatisticalReport/cards-container'
import ChartContainer from '@/components/StatisticalReport/chart-container'
import ChartPercentageCard from '@/components/StatisticalReport/chart-percentage-card'
import StatisticalCard from '@/components/StatisticalReport/statistical-card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClient, useFetch } from '@/hooks/useQuery'
import { AcademicYearRes, IdeaReportRes } from '@/types/api'
import { colorGenerator } from '@/utils/color-generator'
import { Chart as ChartJS } from 'chart.js/auto'
import { Lightbulb, MessageSquare, MessageSquareOff, ThumbsDown, ThumbsUp, Users } from 'lucide-react'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { SEMESTER_FILTER } from '@/constants/semester-filter'

ChartJS.register()

export default function IdeaReport() {
  const { data: academicYears } = useFetch<AcademicYearRes, true>(`academicInfos`)
  const [semesterId, setSemesterId] = useState<string | null>(null)
  const [data, setData] = useState<IdeaReportRes | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const client = useClient()

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const { data } = await client(`/statistical-reports/ideas?semesterId=${semesterId}`)
    setData(data)
    setIsLoading(false)
  }

  return (
    <>
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
            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
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

              <CardsContainer title='Ideas / Contributors by Department'>
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
                        datasets: [
                          {
                            label: 'Ideas',
                            data: data.departmentPercentage.map(department => department.percentage),
                            backgroundColor: '#ffe0e660',
                            borderColor: '#ff6384',
                            borderWidth: 2,
                            stack: 'Stack 0',
                          },
                          {
                            label: 'Contributors',
                            data: data.contributorPercentage.map(contributor => contributor.percentage),
                            backgroundColor: '#c8dfdf60',
                            borderColor: '#42d09e',
                            borderWidth: 2,
                            stack: 'Stack 1',
                          },
                        ],
                        labels: data.departmentPercentage.map(department => department.department.name),
                      }}
                    />
                  </div>
                  <h3 className='w-full'>Percentage of Ideas</h3>
                  <div className='flex flex-wrap gap-4 items-center'>
                    {data.departmentPercentage.map(department => (
                      <ChartPercentageCard
                        key={department.department.id}
                        title={department.department.name}
                        value={department.percentage}
                        color={'#ff6384'}
                      />
                    ))}
                  </div>

                  <h3 className='w-full mt-2'>Percentage of Contributors</h3>
                  <div className='flex flex-wrap gap-4 items-center'>
                    {data.contributorPercentage.map(contributor => (
                      <ChartPercentageCard
                        key={contributor.department.id}
                        title={contributor.department.name}
                        value={contributor.percentage}
                        color={'#42d09e'}
                      />
                    ))}
                  </div>
                </>
              </CardsContainer>
            </div>
          </>
        )
      )}
    </>
  )
}
