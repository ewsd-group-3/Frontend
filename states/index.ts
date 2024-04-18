import { atom } from 'recoil'

export const currentSemesterState = atom<
  | {
      id: number
      name: string
      closureDate: string
      finalClosureDate: string
      academicInfo: {
        id: number
        name: string
      }
    }
  | undefined
>({
  key: 'currentSemester',
  default: undefined,
})
