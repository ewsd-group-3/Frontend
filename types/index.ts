import { DepartmentRes, StaffRes } from './api'

export type Department = {
  count: number
  departments: DepartmentRes[]
}

export type Staff = {
  count: number
  staffs: StaffRes[]
}
