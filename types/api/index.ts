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

export type Department = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type DepartmentRes = ListingRes & {
  departments: Department[]
}

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

export type ProfileRes = {
  staff: Staff
}
