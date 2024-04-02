import { Newspaper, AudioLines, Blocks, BarChartBig, UsersRound, Building2, CalendarRange, PieChart, Ban } from 'lucide-react'

export const MenuLinks = [
  { title: 'Ideas', path: '/', src: Newspaper },
  { title: 'Staff', path: '/staff', src: UsersRound, gap: true },
  { title: 'Department', path: '/department', src: Building2 },
  { title: 'Academic Year', path: '/academic-year', src: CalendarRange },
  { title: 'Category', path: '/category', src: Blocks, gap: true },
  { title: 'Announcement', path: '/announcement', src: AudioLines },
  { title: 'Statistical Report', path: '/statistical-report', src: BarChartBig },
  { title: 'Reported List', path: '/reported-list', src: Ban, gap: true },
  { title: 'System Report', path: '/system-report', src: PieChart },
]
