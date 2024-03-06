import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { setRecoil } from './RecoilStatePortal'
import { dialogState } from '@/states/dialog'
import { Dialog } from '@/types/dialog'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showDialog(dialog: Dialog) {
  setRecoil(dialogState, dialog)
}
