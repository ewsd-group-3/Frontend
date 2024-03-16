import { ReactNode } from 'react'
 
export type Dialog = { title: string } & Partial<{
  description: string
  children: ReactNode | Function
  className: string
  defaultValues: any
  formSchema: any
  cancel:  boolean | {
    label: string
    onClick?: () => void
  }
  action: {
    label: string
    onClick?: () => void
  }
  onSubmit: (data: any) => void
}>
