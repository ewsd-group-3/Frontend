import { date, z } from 'zod'
import React from 'react'
import { Form } from '../ui/form'
import DatePicker from '../ui/date-picker'
import Divider from '../ui/divider'
import { Button } from '../ui/button'
import { addDays } from 'date-fns'

export const academicYearFormSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  firstSemStartDate: z.date(),
  firstSemEndDate: z.date(),
  firstSemFinalClosureDate: z.date(),
  secondSemStartDate: z.date(),
  secondSemEndDate: z.date(),
  secondSemFinalClosureDate: z.date(),
})

const AcademicYearForm = ({
  onSubmit,
  defaultValues = {},
  isEdit = false,
}: {
  onSubmit: (values: z.infer<typeof academicYearFormSchema>) => void
  defaultValues?: z.infer<typeof academicYearFormSchema> | Object
  isEdit?: boolean
}) => {
  return (
    <Form defaultValues={defaultValues} formSchema={academicYearFormSchema} onSubmit={onSubmit}>
      {values => {
        const [startDate, endDate, firstSemStartDate, firstSemEndDate, firstSemFinalClosureDate, secondSemStartDate, secondSemEndDate] = values.watch(
          [
            'startDate',
            'endDate',
            'firstSemStartDate',
            'firstSemEndDate',
            'firstSemFinalClosureDate',
            'secondSemStartDate',
            'secondSemEndDate',
            'secondSemFinalClosureDate',
          ],
        )
        return (
          <>
            <div>
              <div className='flex justify-between my-5 text-right w-full'>
                <h4 className='font-bold mb-3 text-xl'>Academic year</h4>
                <Button className='w-[120px]' type='submit'>
                  {isEdit ? 'Edit' : 'Create'}
                </Button>
              </div>
              <div className='flex space-x-10'>
                <DatePicker name='startDate' label='Start date' disabled={isEdit} />
                <DatePicker name='endDate' label='End date' minDate={startDate} disabled={!startDate} />
              </div>
            </div>
            <Divider />
            <div>
              <h4 className='font-bold mb-3 text-xl'>Semesters</h4>
              <div>
                <h5 className='font-bold mb-2 text-lg'>First Semester</h5>
                <div className='flex space-x-10'>
                  <DatePicker name='firstSemStartDate' label='Start date' minDate={startDate} maxDate={endDate} disabled={!endDate} />
                  <DatePicker
                    name='firstSemEndDate'
                    label='Closure date / Semester end date'
                    minDate={addDays(firstSemStartDate, 1)}
                    maxDate={endDate}
                    disabled={!firstSemStartDate}
                  />
                  <DatePicker
                    name='firstSemFinalClosureDate'
                    label='Final closure date'
                    minDate={addDays(firstSemEndDate, 1)}
                    maxDate={endDate}
                    disabled={!firstSemEndDate}
                  />
                </div>
              </div>

              <div className='mt-5'>
                <h5 className='font-bold mb-2 text-lg'>Second Semesterr</h5>
                <div className='flex space-x-10'>
                  <DatePicker
                    name='secondSemStartDate'
                    label='Start date'
                    minDate={addDays(firstSemFinalClosureDate, 1)}
                    maxDate={endDate}
                    disabled={isEdit || !firstSemFinalClosureDate}
                  />
                  <DatePicker
                    name='secondSemEndDate'
                    label='Closure date / Semester end date'
                    minDate={addDays(secondSemStartDate, 1)}
                    maxDate={endDate}
                    disabled={isEdit || !secondSemStartDate}
                  />
                  <DatePicker
                    name='secondSemFinalClosureDate'
                    label='Final closure date'
                    minDate={addDays(secondSemEndDate, 1)}
                    maxDate={endDate}
                    disabled={!secondSemEndDate}
                  />
                </div>
              </div>
            </div>
          </>
        )
      }}
    </Form>
  )
}

export default AcademicYearForm
