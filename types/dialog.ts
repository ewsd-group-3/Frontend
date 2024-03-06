import { ReactNode } from 'react'

// TODO: Remove any
export type Dialog = { title: string } & Partial<{
  description: string
  children: ReactNode | Function
  className: string
  defaultValues: any
  formSchema: any
  cancel?: ReactNode
  onSubmit: (data: any) => void
}>
