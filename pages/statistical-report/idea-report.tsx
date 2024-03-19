import CardsContainer from '@/components/StatisticalReport/cards-container'
import StatisticalCard from '@/components/StatisticalReport/statistical-card'
import { Lightbulb, MessageSquare, MessageSquareOff, ThumbsDown, ThumbsUp, Users } from 'lucide-react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

ChartJS.register()

export default function IdeaReport() {
  return (
    <>
      <div></div>
      <CardsContainer title='Total contributors'>
        <StatisticalCard icon={{ src: Lightbulb }} title='Ideas' value={2} />
        <StatisticalCard icon={{ src: MessageSquare }} title='Comments' value={2} />
        <StatisticalCard icon={{ src: ThumbsUp }} title='Up votes' value={2} />
        <StatisticalCard icon={{ src: ThumbsDown }} title='Down votes' value={2} />
        <StatisticalCard icon={{ src: Users }} title='Contributors' value={2} />
      </CardsContainer>
      <div className='mt-4 flex items-center gap-4'>
        <CardsContainer size='fit' title='Anonymous contributors'>
          <StatisticalCard icon={{ src: Lightbulb }} title='Ideas' value={2} />
          <StatisticalCard icon={{ src: MessageSquare }} title='Comments' value={2} />
        </CardsContainer>

        <CardsContainer size='fit' title='No comments ideas'>
          <StatisticalCard icon={{ src: MessageSquareOff }} title='Ideas' value={2} />
        </CardsContainer>
      </div>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2'>
        <div>
          <Bar
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
            options={{ responsive: true }}
          />
        </div>
        <div>
          <Bar
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
        </div>
      </div>
    </>
  )
}
