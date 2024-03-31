import { Department } from './api'

type Staff = {
  id: number
  email: string
  name: string
  role: string
  isActive: boolean
  departmentId: number
  lastLoginDate: string
  createdAt: string
  updatedAt: string
  department: Department
}

type Tokens = {
  access: {
    token: string
    expires: string
  }
}

export type LoggedInData = {
  staff: Staff
  tokens: Tokens
}

type LoginResponse = {
  statusCode: number
  message: string
  data: LoggedInData
}
