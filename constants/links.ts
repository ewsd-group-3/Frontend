import { Newspaper, AudioLines, Blocks, BarChartBig, UsersRound, Building2, CalendarRange, PieChart, Ban, LucideIcon } from 'lucide-react'

export type AllowedRole = 'ADMIN' | 'QA_COORDINATOR' | 'QA_MANAGER' | 'STAFF'

// 'admin' => 'admin@wayne.uni.gt'
// 'staff' => 'Emily.Jones@wayne.uni.gt'
// 'QA_MANAGER' => 'Michael.Brown@wayne.uni.gt'
// 'QA_COORDINATOR' => 'qa_coordinator@gre.ac.uk'

type MenuLink = {
  title: string
  path: string
  src: LucideIcon
  allowedRoles: AllowedRole[]
  gap?: boolean
}

export const MenuLinks: MenuLink[] = [
  { title: 'Ideas', path: '/', src: Newspaper, allowedRoles: ['ADMIN', 'QA_MANAGER', 'QA_COORDINATOR', 'STAFF'] },
  { title: 'Staff', path: '/staff', src: UsersRound, gap: true, allowedRoles: ['ADMIN'] },
  { title: 'Department', path: '/department', src: Building2, allowedRoles: ['ADMIN'] },
  { title: 'Academic year', path: '/academic-year', src: CalendarRange, allowedRoles: ['ADMIN', 'QA_MANAGER'] },
  { title: 'Category', path: '/category', src: Blocks, gap: true, allowedRoles: ['QA_MANAGER'] }, // Double confirm if ADMIN is allowed for category
  { title: 'Announcement', path: '/announcement', src: AudioLines, allowedRoles: ['QA_COORDINATOR'] },
  { title: 'Statistical Report', path: '/statistical-report', src: BarChartBig, allowedRoles: ['QA_MANAGER', 'QA_COORDINATOR'] }, // QA_COOR is only for their department
  { title: 'Reported List', path: '/reported-list', src: Ban, gap: true, allowedRoles: ['QA_MANAGER'] },
  { title: 'System Report', path: '/system-report', src: PieChart, allowedRoles: ['ADMIN'] },
]
