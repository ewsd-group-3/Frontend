import AcademicYearForm, { academicYearFormSchema } from '@/components/Form/AcademicYear'
import { useMutate } from '@/hooks/useQuery'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { z } from 'zod'

const CreateAcademicYear = () => {
  const { mutateAsync } = useMutate()
  const router = useRouter()

  const handleCreateAcademicYear = async (values: z.infer<typeof academicYearFormSchema>) => {
    const payload = {
      name: `${format(values.startDate, 'LLL yyyy')}  ~ ${format(values.endDate, 'LLL yyyy')}`,
      startDate: values.startDate,
      endDate: values.endDate,
      semesters: [
        {
          name: `Semester 1 - ${values.firstSemStartDate.getFullYear()}-${values.firstSemEndDate.getFullYear()}`,
          startDate: values.firstSemStartDate,
          closureDate: values.firstSemEndDate,
          finalClosureDate: values.firstSemFinalClosureDate,
        },
        {
          name: `Semester 2 - ${values.secondSemStartDate.getFullYear()}-${values.secondSemEndDate.getFullYear()}`,
          startDate: values.secondSemStartDate,
          closureDate: values.secondSemEndDate,
          finalClosureDate: values.secondSemFinalClosureDate,
        },
      ],
    }

    const res = await mutateAsync({
      url: `academicInfos`,
      data: payload,
    })

    if (res.statusCode == 201) {
      router.push('/academic-year')
    }
  }

  return (
    <div className='p-5'>
      <h2 className='font-bold text-2xl mb-5'>Create Academic Year</h2>
      <AcademicYearForm onSubmit={handleCreateAcademicYear} />
    </div>
  )
}

export default CreateAcademicYear
