import { LoggedInData } from '@/types/auth'
import { AtomEffect, atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const authState = atom<LoggedInData | undefined | null>({
  key: 'auth',
  default: undefined,
  effects: [persistAtom],
})

export const isClientSideState = atom({ key: 'client-side', default: false })
