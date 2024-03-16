import { authState } from '@/states/auth'
import { useRecoilState } from 'recoil'
import { useFetch } from '@/hooks/useQuery'
import { ProfileRes } from '@/types/api'
import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import { roleStringConvertor } from '@/utils/role-convertor'
import { Building2, Mail, Settings, Settings2 } from 'lucide-react'
import { formateDate } from '@/lib/date'

export default function Profile() {
  const [auth] = useRecoilState(authState)
  const { data, isLoading } = useFetch<ProfileRes, true>(`staffs/${auth?.staff.id}`)
  const profile = data?.data?.staff

  return (
    <div className='p-8'>
      {!isLoading && profile && (
        <div className='rounded-xl bg-white flex flex-col p-12 relative'>
          <div className='absolute right-12 top-12'>
            <button className='p-2 rounded-full bg-gray-300 hover:bg-gray-400'>
              <Settings size={24} />
            </button>
          </div>
          <div className='flex  flex-wrap gap-8 md:items-center'>
            <div className='ring ring-black rounded-full mx-auto md:mx-0'>
              <AvatarIcon name={profile.name} size='lg' />
            </div>
            <div className='flex flex-col gap-1'>
              <h1 className='text-2xl font-semibold'>{profile.name}</h1>
              <span className='capitalize font-medium'>Role: {roleStringConvertor(profile.role)}</span>
              <span>Last active: {formateDate(profile.lastLoginDate, 'd MMM y, hh:mm:ss a')}</span>
            </div>
          </div>
          <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='p-6 rounded bg-gray-300 flex items-center gap-3'>
              <Mail size={36} />
              {profile.email}
            </div>
            <div className='p-6 rounded bg-gray-300 flex items-center gap-3'>
              <Building2 size={36} />
              {profile.department.name}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
