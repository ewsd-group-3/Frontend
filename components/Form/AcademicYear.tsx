import { date, z } from 'zod'
import React from 'react'
import { Form } from '../ui/form'
import DatePicker from '../ui/date-picker'
import Divider from '../ui/divider'
import { Button } from '../ui/button'
import { addDays, subDays } from 'date-fns'

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
        const [
          startDate,
          endDate,
          firstSemStartDate,
          firstSemEndDate,
          firstSemFinalClosureDate,
          secondSemStartDate,
          secondSemEndDate,
          secondSemFinalClosureDate,
        ] = values.watch([
          'startDate',
          'endDate',
          'firstSemStartDate',
          'firstSemEndDate',
          'firstSemFinalClosureDate',
          'secondSemStartDate',
          'secondSemEndDate',
          'secondSemFinalClosureDate',
        ])
        return (
          <div className='max-w-[900px]'>
            <div>
              <h4 className='my-5 font-bold mb-3 text-xl'>Academic year</h4>

              <div className=' grid grid-cols-academicForm gap-5 grid-flow-row'>
                <DatePicker name='startDate' label='Start date' />
                <DatePicker name='endDate' label='End date' minDate={isEdit ? secondSemFinalClosureDate : startDate} disabled={!startDate} />
                <div />
              </div>
            </div>
            <Divider />
            <div>
              <h4 className='font-bold mb-3 text-xl'>Semesters</h4>
              <div>
                <h5 className='font-bold mb-2 text-lg'>First Semester</h5>
                <div className='grid grid-cols-academicForm gap-5 grid-flow-row'>
                  <DatePicker name='firstSemStartDate' label='Start date' minDate={startDate} maxDate={endDate} disabled={false || !endDate} />
                  <DatePicker
                    name='firstSemEndDate'
                    label='Closure date / Semester end date'
                    minDate={addDays(firstSemStartDate, 1)}
                    maxDate={isEdit ? subDays(firstSemFinalClosureDate, 1) : endDate}
                    disabled={!firstSemStartDate}
                  />
                  <DatePicker
                    name='firstSemFinalClosureDate'
                    label='Final closure date'
                    minDate={addDays(firstSemEndDate, 1)}
                    maxDate={isEdit ? subDays(secondSemStartDate, 1) : endDate}
                    disabled={!firstSemEndDate}
                  />
                </div>
              </div>

              <div className='mt-5'>
                <h5 className='font-bold mb-2 text-lg'>Second Semester</h5>
                <div className='grid grid-cols-academicForm gap-5 grid-flow-row'>
                  <DatePicker
                    name='secondSemStartDate'
                    label='Start date'
                    minDate={addDays(firstSemFinalClosureDate, 1)}
                    maxDate={endDate}
                    disabled={!firstSemFinalClosureDate}
                  />
                  <DatePicker
                    name='secondSemEndDate'
                    label='Closure date / Semester end date'
                    minDate={addDays(secondSemStartDate, 1)}
                    maxDate={isEdit ? subDays(secondSemFinalClosureDate, 1) : endDate}
                    disabled={!secondSemStartDate}
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

              <div className='flex justify-end'>
                <Button className='w-[120px] col-start-3 mt-10 ml-auto' type='submit'>
                  {isEdit ? 'Edit' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        )
      }}
    </Form>
  )
}

export default AcademicYearForm
