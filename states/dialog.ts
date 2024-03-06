import { Dialog } from '@/types/dialog'
import { atom } from 'recoil'

export const dialogState = atom<undefined | Dialog>({
  key: 'dialogState',
  default: undefined,
})
