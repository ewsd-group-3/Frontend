export type StaffRes = {
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

export type DepartmentRes = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
