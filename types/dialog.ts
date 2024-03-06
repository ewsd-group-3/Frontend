import { ReactNode } from 'react'

export type Dialog = { title: string } & Partial<{
  description: string
  children: ReactNode
  className: string
}>
