import { AllowedRole } from '@/constants/links'

type Staff = {
  id: number
  email: string
  name: string
  role: AllowedRole
  isActive: boolean
  departmentId: number
  lastLoginDate: string
  createdAt: string
  updatedAt: string
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
