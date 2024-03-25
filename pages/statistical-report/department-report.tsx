import CardsContainer from '@/components/StatisticalReport/cards-container'
import StatisticalCard from '@/components/StatisticalReport/statistical-card'
import { Lightbulb, MessageSquare, MessageSquareOff, ThumbsDown, ThumbsUp, Users } from 'lucide-react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import ChartContainer from '@/components/StatisticalReport/chart-container'
import ChartPercentageCard from '@/components/StatisticalReport/chart-percentage-card'
import { useFetch } from '@/hooks/useQuery'
import { DepartmentRes } from '@/types/api'
import { Select, SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

ChartJS.register()

export default function DepartmentReport() {
  const { data: departments } = useFetch<DepartmentRes, true>(`departments`)

  return (
    <>
      <form className='mb-4 flex items-center'>
        <Select>
          <SelectTrigger className='w-[320px]'>
            <SelectValue placeholder='Department' />
          </SelectTrigger>
          <SelectContent>
            {departments?.data.departments.map(department => (
              <SelectItem key={department.id} value={department.id.toString()}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant='default' className='ml-4'>
          Search
        </Button>
      </form>

      <CardsContainer title='Total contributors' size='fit'>
        <StatisticalCard icon={{ src: Lightbulb }} title='Ideas' value={2} />
        <StatisticalCard icon={{ src: MessageSquare }} title='Comments' value={2} />
        <StatisticalCard icon={{ src: ThumbsUp }} title='Up votes' value={2} />
        <StatisticalCard icon={{ src: ThumbsDown }} title='Down votes' value={2} />
        <StatisticalCard icon={{ src: Users }} title='Contributors' value={2} />
      </CardsContainer>
      <div className='mt-4 flex flex-wrap items-center gap-4'>
        <CardsContainer size='fit' title='Anonymous contributors'>
          <StatisticalCard icon={{ src: Lightbulb }} title='Ideas' value={2} />
          <StatisticalCard icon={{ src: MessageSquare }} title='Comments' value={2} />
        </CardsContainer>

        <CardsContainer size='fit' title='No comments ideas'>
          <StatisticalCard icon={{ src: MessageSquareOff }} title='Ideas' value={2} />
        </CardsContainer>
      </div>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <ChartContainer title='Ideas by Category'>
          <>
            <div>
              <Bar
                width={100}
                height={360}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                data={{
                  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                  datasets: [
                    {
                      label: '# of Votes',
                      data: [12, 19, 3, 5, 2, 3],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
            <div className='flex flex-wrap gap-4 items-center'>
              <ChartPercentageCard title='Category 1' value={16} />
            </div>
          </>
        </ChartContainer>
        <CardsContainer title='Ideas / Contributors by Department'>
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
                  label: 'Dataset 1',
                  data: [10, 20, 30],
                  backgroundColor: 'red',
                  stack: 'Stack 0',
                },
                {
                  label: 'Dataset 2',
                  data: [40, 50, 60],
                  backgroundColor: 'blue',
                  stack: 'Stack 1',
                },
              ],
              labels: ['Red', 'Blue', 'Green'],
            }}
          />
        </CardsContainer>
      </div>
    </>
  )
}
