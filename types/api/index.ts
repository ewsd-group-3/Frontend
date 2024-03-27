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
  semesters: { id: number; name: string; startDate: string }[]
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
}

export type IdeaRes = ListingRes & {
  ideas: Idea[]
}

interface IdeaCategory {
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

export interface IdeaDetail {
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
  author: Author
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
