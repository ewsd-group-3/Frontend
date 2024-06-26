export type ListingRes = {
  count: number
  limit: number
  page: number
  totalPages: number
}

export type Staff = {
  id: number
  email: string
  name: string
  role: string
  isActive: boolean
  departmentId: number
  lastLoginDate: string
  createdAt: string
  updatedAt: string
  department: {
    id: string
    name: string
  }
}

export type StaffRes = ListingRes & {
  staffs: Staff[]
}

export type StaffDetail = {
  staff: {
    id: number
    email: string
    name: string
    role: string
    isActive: boolean
    departmentId: number
    lastLoginDate: string
    createdAt: string
    updatedAt: string
    department: {
      id: number
      name: string
    }
  }
}

export type Category = {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CategoryRes = ListingRes & {
  categories: Category[]
}

export type Department = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type DepartmentRes = ListingRes & {
  departments: Department[]
}

export type Announcement = {
  id: number
  subject: string
  content: string
  type: string
  announcerId: number
  createdAt: string
  updatedAt: string
  audiences: Audience[]
}

export type Audience = {
  id: number
  status: string
  staffId: number
  staff: Staff
  departmentId: number
  announcementId: number
  createdAt: string
  updatedAt: string
}

export type AnnouncementRes = ListingRes & {
  announcements: Announcement[]
}

type AnnouncementCreateBase = {
  announcerId: number
  subject: string
  content: string
  type: 'ALL' | 'SPECIFIC'
}

interface SpecificAnnouncement extends AnnouncementCreateBase {
  type: 'SPECIFIC'
  staffIds: number[] // Mandatory if type === SPECIFIC
}

export type AnnouncementCreate = AnnouncementCreateBase | SpecificAnnouncement

export type AcademicYearT = {
  id: string
  name: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  semesters: { id: number; name: string; startDate: string; status: 'Ongoing' | 'Upcoming' | 'Done' }[]
}

export type AcademicYearRes = ListingRes & {
  academicInfos: AcademicYearT[]
}

export type Semester = {
  id: number
  name: string
  startDate: string
  closureDate: string
  finalClosureDate: string
  academicInfoId: number
  createdAt: string
  updatedAt: string
}

export type AcademicYearDetail = {
  id: string
  name: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  semesters: Semester[]
  status: 'Done' | 'Ongoing' | 'Upcoming'
}

export type ProfileRes = {
  staff: Staff
}

export type Idea = {
  id: number
  title: string
  description: string
  isAnonymous: boolean
  isHidden: boolean
  authorId: number
  semesterId: number
  createdAt: string
  updatedAt: string
  ideaCategories: {
    id: number
    ideaId: number
    categoryId: number
    createdAt: string
    updatedAt: string
    category: {
      id: number
      name: string
      isActive: true
      createdAt: string
      updatedAt: string
    }
  }[]
  ideaDocuments: {
    id: number
    name: string
    documenttype: string
    documentDownloadUrl: string
    documentDeleteUrl: string
    createdAt: string
    updatedAt: string
  }[]
  author: {
    id: number
    email: string
    name: string
    // password: string
    role: string
    isActive: boolean
    departmentId: number
    profile: {
      name: string
      documenttype: string
      documentDeleteUrl: string
      documentDownloadUrl: string
    }
    lastLoginDate: string
    createdAt: string
    updatedAt: string
  }
  votes: {
    id: number
    isThumbUp: boolean
    staffId: number
    ideaId: number
    createdAt: string
    updatedAt: string
  }[]
  comments: {
    id: number
    content: string
    isAnonymous: boolean
    staffId: number
    ideaId: number
    createdAt: string
    updatedAt: string
  }[]
  views: []
  currentSemester: {
    name: string
    id: string
    startDate: string
    closureDate: string
    finalClosureDate: string
    academicInfo: {
      name: string
      id: string
    }
  }
}

export type IdeaRes = ListingRes & {
  ideas: Idea[]
}

export interface IdeaCategory {
  id: number
  ideaId: number
  categoryId: number
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

interface Author {
  id: number
  name: string
  email: string
}

export interface CommentI {
  id: number
  content: string
  isAnonymous: boolean
  staffId: number
  ideaId: number
  createdAt: string
  updatedAt: string
  staff: Staff
}

export interface Vote {
  id: number
  isThumbUp: boolean
  staffId: number
  ideaId: number
  createdAt: string
  updatedAt: string
}

interface IdeaDocument {
  id: number
  name: string
  documenttype: string
  documentDownloadUrl: string
  documentDeleteUrl: string
  ideaId: number
  createdAt: string
  updatedAt: string
}

export interface IdeaDetailI {
  id: number
  title: string
  description: string
  isAnonymous: boolean
  isHidden: boolean
  authorId: number
  semesterId: number
  createdAt: string
  updatedAt: string
  ideaCategories: IdeaCategory[]
  author: Author & {
    department: Department
  }
  semester: {
    id: number
    name: string
    startDate: string
    closureDate: string
    finalClosureDate: string
    academicInfoId: number
    createdAt: string
    updatedAt: string
  }
  comments: CommentI[]
  votes: Vote[]
  views: any[] // You can define a type if views have a specific structure
  ideaDocuments: IdeaDocument[]

  likeStatus: 'like' | 'dislike' | 'none'
}

type CategoryPercentage = {
  category: Category
  percentage: number
}

type DepartmentPercentage = {
  department: Department
  percentage: number
}

type StatisticalReport = {
  ideasCount: number
  commentsCount: number
  upVotesCount: number
  downVotesCount: number
  contributorsCount: number
  anonymousCount: number
  anonymousCmtCount: number
  noCommentCount: number
}

export type IdeaReportRes = StatisticalReport & {
  categoryPercentage: CategoryPercentage[]
  departmentPercentage: DepartmentPercentage[]
  contributorPercentage: DepartmentPercentage[]
}

export type DepartmentReportRes = StatisticalReport & {
  categoryPercentage: CategoryPercentage[]
}

export type SystemReportRes = {
  topActiveUsers: TopActiveUser[]
  mostUsedBrowsers: MostUsedBrowser[]
  mostViewedIdeas: MostViewedIdea[]
  count: number
  limit: number
  page: number
  totalPages: number
}

interface TopActiveUser {
  staff: Staff
  ideasCount: number
  commentsCount: number
  votesCount: number
  viewsCount: number
  total: number
}

interface MostUsedBrowser {
  browserName: string
  totalLogins: number
}

export interface MostViewedIdea {
  id: number
  title: string
  description: string
  isAnonymous: boolean
  isHidden: boolean
  authorId: number
  semesterId: number
  createdAt: string
  updatedAt: string
  views: View[]
  author: Author
  viewsCount: number
  ideaCategories: {
    category: Category
    categoryId: number
    createdAt: string
    id: number
    ideaId: number
    updatedAt: string
  }[]
}

interface View {
  id: number
  staffId: number
  ideaId: number
  createdAt: string
  updatedAt: string
}

export interface CurrentSemeter {
  semester: {
    id: number
    name: string
    startDate: string
    closureDate: string
    finalClosureDate: string
    academicInfoId: number
    createdAt: string
    updatedAt: string
    academicInfo: {
      id: number
      name: string
      startDate: string
      endDate: string
      createdAt: string
      updatedAt: string
    }
  }
}

export type Report = {
  id: number
  reason: string
  isApproved: boolean
  approvedAt: string | null
  ideaId: number
  reportById: number
  approvedById: number | null
  createdAt: string
  updatedAt: string
  idea: {
    id: number
    title: string
    description: string
    isAnonymous: boolean
    isHidden: boolean
    authorId: number
    semesterId: number
    createdAt: string
    updatedAt: string
  }
  reportBy: {
    id: number
    email: string
    name: string
    password: string
    role: string
    isActive: boolean
    departmentId: number
    profile: any // Type this accordingly if profile has known structure
    lastLoginDate: string
    createdAt: string
    updatedAt: string
  }
  isIdeaHidden: false
  isRejected: true
  isStaffActive: true
}

export type ReportRes = {
  page: number
  limit: number
  count: number
  totalPages: number
  reports: Report[]
}
