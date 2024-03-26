import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRecoilState } from 'recoil'

export default function AccouncementCreate() {
  const [auth, setAuth] = useRecoilState(authState)

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
        <RadioGroup defaultValue='option-one'>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='option-one' id='option-one' />
            <Label htmlFor='option-one'>All staff from </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='option-two' id='option-two' />
            <Label htmlFor='option-two'>Option Two</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
