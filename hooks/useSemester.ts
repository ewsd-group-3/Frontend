import { currentSemesterState } from '@/states'
import { useFetch } from './useQuery'
import { CurrentSemeter } from '@/types/api'
import { isBefore } from 'date-fns'
import { useRecoilState } from 'recoil'

const useSemester = () => {
  const { data } = useFetch<CurrentSemeter, true>('academicinfos/currentSemester')

  const [currentSemester, setCurrentSemester] = useRecoilState(currentSemesterState)
  const currentSemData = data?.data

  if (currentSemData && currentSemData?.semester?.academicInfoId !== currentSemester?.academicInfo.id) {
    setCurrentSemester({
      id: currentSemData.semester.id,
      academicInfo: {
        id: currentSemData?.semester?.academicInfoId,
        name: currentSemData?.semester?.academicInfo?.name,
      },
      name: currentSemData?.semester?.name,
      closureDate: currentSemData?.semester?.closureDate,
      finalClosureDate: currentSemData?.semester?.finalClosureDate,
    })
  }

  const isBeforeClosureDate = (date: Date = new Date()) => {
    if (!currentSemData?.semester?.closureDate) {
      return false
    }

    return isBefore(date, new Date(currentSemData?.semester?.closureDate))
  }

  const isBeforeFinalClosureDate = (date: Date = new Date()) => {
    if (!currentSemData?.semester?.finalClosureDate) {
      return false
    }

    return isBefore(date, new Date(currentSemData?.semester?.finalClosureDate))
  }

  return { isBeforeClosureDate, isBeforeFinalClosureDate }
}

export default useSemester
