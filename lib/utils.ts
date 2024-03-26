import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { setRecoil } from './RecoilStatePortal'
import { dialogState } from '@/states/dialog'
import { Dialog } from '@/types/dialog'
import { formatDistance } from 'date-fns'
import { imageExtensions } from '@/constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showDialog(dialog: Dialog) {
  setRecoil(dialogState, dialog)
}

export function hideDialog() {
  setRecoil(dialogState, undefined)
}

export function getDateDistance(date: string) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export function isImage(url: string) {
  const substrings = url.split('.')
  return imageExtensions.includes(substrings[substrings.length - 1])
}
