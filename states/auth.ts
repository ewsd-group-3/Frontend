import { LoggedInData } from '@/types/auth'
import { AtomEffect, atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

const persistAtomEffect: AtomEffect<any> = param => {
  param.getPromise(isClientSideState).then(() => persistAtom(param))
}

export const authState = atom<LoggedInData | undefined | null>({
  key: 'auth',
  default: undefined,
  effects: [persistAtomEffect],
})

export const isClientSideState = atom({ key: 'client-side', default: false })
