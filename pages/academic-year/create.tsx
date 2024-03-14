import React from 'react'
import { date, z } from 'zod'
import DatePicker from '@/components/ui/date-picker'
import { Form } from '@/components/ui/form'
import Divider from '@/components/ui/divider'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  firstSemStartDate: z.date(),
  firstSemEndDate: z.date(),
  firstSemFinalClosureDate: z.date(),
  secondSemStartDate: z.date(),
  secondSemEndDate: z.date(),
  secondSemFinalClosureDate: z.date(),
})

const CreateAcademicYear = () => {
  return (
    <div className='p-5'>
      <h2 className='font-bold text-2xl mb-5'>Create Academic Year</h2>

      <Form
        defaultValues={{
          startDate: undefined,
          endDate: undefined,
          firstSemStartDate: undefined,
          firstSemEndDate: undefined,
          firstSemFinalClosureDate: undefined,
          secondSemStartDate: undefined,
          secondSemEndDate: undefined,
        }}
        formSchema={formSchema}
      >
        {values => {
          const [startDate, endDate, firstSemStartDate, firstSemEndDate, firstSemFinalClosureDate, secondSemStartDate, secondSemEndDate] =
            values.watch([
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
            <>
              <div>
                <h4 className='font-bold mb-3 text-xl'>Academic year</h4>
                <div className='flex space-x-10'>
                  <DatePicker name='startDate' label='Start date' />
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
                      minDate={firstSemStartDate}
                      maxDate={endDate}
                      disabled={!firstSemStartDate}
                    />
                    <DatePicker
                      name='firstSemFinalClosureDate'
                      label='Final closure date'
                      minDate={firstSemEndDate}
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
                      minDate={firstSemFinalClosureDate}
                      maxDate={endDate}
                      disabled={!firstSemFinalClosureDate}
                    />
                    <DatePicker
                      name='secondSemEndDate'
                      label='Closure date / Semester end date'
                      minDate={secondSemStartDate}
                      maxDate={endDate}
                      disabled={!secondSemStartDate}
                    />
                    <DatePicker
                      name='secondSemFinalClosureDate'
                      label='Final closure date'
                      minDate={secondSemEndDate}
                      maxDate={endDate}
                      disabled={!secondSemEndDate}
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-center mt-16 gap-4 text-right w-full'>
                <Button>Reset</Button>
                <Button>Create</Button>
              </div>
            </>
          )
        }}
      </Form>
    </div>
  )
}

export default CreateAcademicYear
