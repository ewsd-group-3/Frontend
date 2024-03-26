import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { authState } from '@/states/auth'
import { Fragment, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Listbox, Transition } from '@headlessui/react'
import { Staff, StaffRes } from '@/types/api'
import { useFetchListing } from '@/hooks/useFetchListing'
import { ChevronsUpDown } from 'lucide-react'

export default function AccouncementCreate() {
  const [auth] = useRecoilState(authState)
  const [type, setType] = useState<'ALL' | 'SPECIFIC'>('ALL')
  const [selectedStaff, setselectedStaff] = useState<Staff[]>([])
  const { data: staffs } = useFetchListing<StaffRes>('staffs', 1000)
  console.log(selectedStaff)
  return (
    <div className='p-5'>
      <h2 className='font-bold text-2xl mb-5'>Create Announcement</h2>

      <div className='grid w-full max-w-[520px] items-center gap-1.5'>
        <Label htmlFor='subject'>Subject Name</Label>
        <Input type='email' id='subject' placeholder='Subject Name' />
      </div>

      <div className='h-[1px] bg-black my-8'></div>

      <div>
        <h3 className='font-bold text-lg mb-5'>Audience</h3>
        <RadioGroup defaultValue={type} onValueChange={(type: 'ALL' | 'SPECIFIC') => setType(type)}>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='ALL' id='ALL' />
            <Label htmlFor='ALL'>All staff from {auth?.staff.departmentId} department</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='SPECIFIC' id='SPECIFIC' />
            <Label htmlFor='SPECIFIC'>Specific staff from {auth?.staff.departmentId} department</Label>
          </div>
        </RadioGroup>

        {type === 'SPECIFIC' && (
          <div className='mt-4'>
            <Listbox value={selectedStaff} onChange={setselectedStaff} multiple>
              <Listbox.Button className='flex items-center gap-4 cursor-pointer relative w-fit rounded-lg bg-white py-2 px-3 text-left shadow-md focus:outline-none focus-visible:ring-offset-2 sm:text-sm">'>
                {selectedStaff.length === 0 ? 'Select staff' : selectedStaff.map(staff => staff.name).join(', ')}
                <ChevronsUpDown />
              </Listbox.Button>
              <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                <Listbox.Options className='absolute mt-1 max-h-60 w-fit overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
                  {staffs &&
                    staffs.data.staffs.map(staff => (
                      <Listbox.Option
                        key={staff.id}
                        value={staff}
                        className={({ active }) =>
                          `cursor-default select-none pl-6 py-2 pr-4 ${active || selectedStaff.includes(staff) ? 'bg-primary text-white' : 'text-gray-900'}`
                        }
                      >
                        {staff.name}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        )}
      </div>
    </div>
  )
}
