import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { setRecoil } from './RecoilStatePortal'
import { dialogState } from '@/states/dialog'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showDialog(dialog: any) {
  setRecoil(dialogState, dialog)
}
