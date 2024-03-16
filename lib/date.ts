import { format, isAfter, isBefore, isWithinInterval } from 'date-fns'

const academicYearStatus = {
  ongoing: 'Ongoing',
  done: 'Done',
  upcoming: 'Upcoming',
}

export const formateDate = (date: string | undefined, formatType = 'd MMM y') => {
  return format(date ?? new Date(), formatType)
}

export const getAcademicYearStatus = (currentDate: string | Date, startDate: string | undefined, endDate: string | undefined) => {
  if (!startDate || !endDate) return

  const isBetween = isWithinInterval(typeof currentDate === 'string' ? new Date(currentDate) : currentDate, {
    start: new Date(startDate),
    end: new Date(endDate),
  })
  if (isBetween) return academicYearStatus.ongoing

  const isbefore = isBefore(currentDate, new Date(startDate))
  if (isbefore) return academicYearStatus.upcoming

  return academicYearStatus.done
}
