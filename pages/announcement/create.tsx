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
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

const Seperator = () => <div className='h-[1px] bg-black my-4 opacity-50'></div>

export default function AccouncementCreate() {
  const [auth] = useRecoilState(authState)
  const [type, setType] = useState<'ALL' | 'SPECIFIC'>('ALL')
  const [selectedStaff, setselectedStaff] = useState<Staff[]>([])
  const { data: staffs } = useFetchListing<StaffRes>(`staffs?departmentId=${auth?.staff.departmentId}`, {
    sortBy: 'id',
    sortType: 'asc',
    page: '1',
    limit: 1000,
  })
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync } = useMutate()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('payload:', { subject, type, selectedStaff, content })
    setIsLoading(true)
    let staffIds = selectedStaff.map(staff => staff.id)

    if (type === 'ALL' && staffs) {
      staffIds = staffs.data.staffs.map(staff => staff.id)
    }

    const res = await mutateAsync({
      url: `announcements/`,
      method: 'POST',
      payload: {
        announcerId: auth?.staff.id,
        subject,
        content,
        type,
        staffIds,
      },
      invalidateUrls: [`announcements`],
    })
    setIsLoading(false)
    if (res.statusCode > 200 && res.statusCode < 300) {
      router.push('/announcement')
    } else {
      console.log(res)
    }
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
                All staff from <b>{auth?.staff.department.name}</b> department
              </Label>
            </div>
            <div className='flex items-center space-x-2 mt-2'>
              <RadioGroupItem value='SPECIFIC' id='SPECIFIC' />
              <Label className='cursor-pointer' htmlFor='SPECIFIC'>
                Specific staff from <b>{auth?.staff.department.name}</b> department
              </Label>
            </div>
          </RadioGroup>

          {type === 'SPECIFIC' && (
            <div className='mt-4'>
              <h6 className='text-sm font-semibold mb-1'>Staff names</h6>
              {selectedStaff.length > 0 && (
                <div className='text-sm text-gray-500 my-4 flex gap-2 items-center flex-wrap'>
                  {selectedStaff.map(staff => (
                    <Badge key={staff.id}>{staff.name}</Badge>
                  ))}
                </div>
              )}
              <Listbox value={selectedStaff} onChange={setselectedStaff} multiple>
                <Listbox.Button className='flex justify-between items-center gap-4 cursor-pointer relative min-w-[200px] w-fit rounded-lg bg-transparent border border-primary py-2 px-3 text-left focus:outline-none focus-visible:ring-offset-2 sm:text-sm hover:bg-primary hover:text-white transition-all'>
                  Select staff
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

        <Button
          className='mt-4 flex ms-auto'
          disabled={isLoading || content === '' || subject === '' || (type === 'SPECIFIC' && selectedStaff.length === 0)}
        >
          Send Email
        </Button>
      </div>
    </form>
  )
}
