import { Newspaper, AudioLines, Blocks, BarChartBig, UsersRound, Building2, CalendarRange } from 'lucide-react'

export const MenuLinks = [
  { title: 'Ideas', path: '/', src: Newspaper },
  { title: 'Staff', path: '/staff', src: UsersRound, gap: true },
  { title: 'Department', path: '/department', src: Building2 },
  { title: 'Academic year', path: '/academic-year', src: CalendarRange },
  { title: 'Category', path: '/category', src: Blocks, gap: true },
  { title: 'Announcement', path: '/announcement', src: AudioLines },
  { title: 'Statistical Report', path: '/statistical-report', src: BarChartBig },
]
