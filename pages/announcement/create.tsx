import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { authState } from '@/states/auth'
import { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Listbox, Transition } from '@headlessui/react'
import { Staff, StaffRes } from '@/types/api'
import { useFetchListing } from '@/hooks/useFetchListing'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutate } from '@/hooks/useQuery'

const Seperator = () => <div className='h-[1px] bg-black my-4 opacity-50'></div>

export default function AccouncementCreate() {
  const [auth] = useRecoilState(authState)
  const [type, setType] = useState<'ALL' | 'SPECIFIC'>('ALL')
  const [selectedStaff, setselectedStaff] = useState<Staff[]>([])
  const { data: staffs } = useFetchListing<StaffRes>('staffs', 1000)
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const { mutateAsync } = useMutate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log({ subject, type, selectedStaff, content })

    const res = await mutateAsync({
      url: `announcements/`,
      method: 'POST',
      payload: {
        announcerId: auth?.staff.id,
        subject,
        content,
        type,
        staffIds: selectedStaff.map(staff => staff.id),
      },
      invalidateUrls: [`announcements`],
    })

    console.log(res)
  }

  return (
    <form className='p-5' onSubmit={handleSubmit}>
      <div className='max-w-[520px]'>
        <h2 className='font-bold text-2xl mb-5'>Create Announcement</h2>

        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='subject'>Subject Name</Label>
          <Input type='text' id='subject' placeholder='Subject Name' onChange={e => setSubject(e.target.value)} required />
        </div>

        <div className='mt-4'>
          <h3 className='font-bold text-lg mb-5'>Audience</h3>
          <RadioGroup defaultValue={type} onValueChange={(type: 'ALL' | 'SPECIFIC') => setType(type)}>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='ALL' id='ALL' />
              <Label className='cursor-pointer' htmlFor='ALL'>
                All staff from {auth?.staff.departmentId} department
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='SPECIFIC' id='SPECIFIC' />
              <Label className='cursor-pointer' htmlFor='SPECIFIC'>
                Specific staff from {auth?.staff.departmentId} department
              </Label>
            </div>
          </RadioGroup>

          {type === 'SPECIFIC' && (
            <div className='mt-4'>
              <Listbox value={selectedStaff} onChange={setselectedStaff} multiple>
                <Listbox.Button className='flex justify-between items-center gap-4 cursor-pointer relative w-fit rounded-lg bg-white py-2 px-3 text-left shadow-md focus:outline-none focus-visible:ring-offset-2 sm:text-sm'>
                  {selectedStaff.length === 0 ? 'Select staff' : selectedStaff.map(staff => staff.name).join(', ')}
                  <span>
                    <ChevronsUpDown size={16} />
                  </span>
                </Listbox.Button>
                <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                  <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-fit overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
                    {staffs &&
                      staffs.data.staffs.map(staff => (
                        <Listbox.Option
                          key={staff.id}
                          value={staff}
                          className={({ active }) =>
                            `flex items-center gap-4 cursor-pointer select-none pl-6 py-2 pr-4 ${active || selectedStaff.includes(staff) ? 'bg-primary text-white' : 'text-gray-900'}`
                          }
                        >
                          {selectedStaff.includes(staff) && <Check size={14} />} {staff.name}
                        </Listbox.Option>
                      ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>
          )}
        </div>
      </div>

      <Seperator />

      <div className='max-w-[520px]'>
        <h3 className='font-bold text-lg mb-5'>Content</h3>

        <textarea
          rows={6}
          className='w-[520px] p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-opacity-75'
          placeholder='Content'
          onChange={e => setContent(e.target.value)}
          required
        ></textarea>

        <Button className='mt-4 flex ms-auto' disabled={content === '' || subject === '' || (type === 'SPECIFIC' && selectedStaff.length === 0)}>
          Send Email
        </Button>
      </div>
    </form>
  )
}
