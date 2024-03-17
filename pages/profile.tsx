import { authState } from '@/states/auth'
import { useRecoilState } from 'recoil'
import { useFetch, useMutate } from '@/hooks/useQuery'
import { ProfileRes } from '@/types/api'
import AvatarIcon from '@/components/AvatarIcon/avatar-icon'
import { roleStringConvertor } from '@/utils/role-convertor'
import { Building2, KeyRound, Mail } from 'lucide-react'
import { formateDate } from '@/lib/date'
import { hideDialog, showDialog } from '@/lib/utils'
import { z } from 'zod'
import { Input } from '@/components/ui/input'

export default function Profile() {
  const { mutateAsync } = useMutate()
  const [auth] = useRecoilState(authState)
  const { data, isLoading } = useFetch<ProfileRes, true>(`staffs/${auth?.staff.id}`)
  const profile = data?.data?.staff

  const handleChangePwd = () => {
    showDialog({
      title: 'Change password',
      // defaultValues: value,
      formSchema: z.object({
        oldPassword: z.string().min(1, { message: 'Old password is required.' }),
        newPassword: z.string().min(1, { message: 'New password is required.' }),
      }),
      children: (
        <div className='mt-5'>
          <Input.Field name='oldPassword' label='Old password' type='password' />
          <div className='mt-3'>
            <Input.Field name='newPassword' label='New password' type='password' />
          </div>
        </div>
      ),
      cancel: true,
      action: {
        label: 'Submit',
      },
      onSubmit: async values => {
        const res = await mutateAsync({
          url: `staffs/change-password`,
          method: 'PATCH',
          payload: {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
          invalidateUrls: [`profile`],
        })

        if (res.statusCode === 200) {
          hideDialog()
        }
      },
    })
  }

  return (
    <div className='p-8'>
      {!isLoading && profile && (
        <div className='rounded-xl bg-white flex flex-col p-12 relative'>
          <div className='absolute right-12 top-12'>
            <button className='p-2 rounded-full bg-gray-300 hover:bg-gray-400' onClick={handleChangePwd}>
              <KeyRound size={24} />
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
