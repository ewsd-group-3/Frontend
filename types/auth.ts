export type AuthType = { title: string } & Partial<{
  description: string
  children: ReactNode | Function
  className: string
  defaultValues: any
  formSchema: any
  cancel?: {
    label: string
    onClick?: () => void
  }
  action?: {
    label: string
    onClick?: () => void
  }
  onSubmit: (data: any) => void
}>
