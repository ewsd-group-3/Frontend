import { DataTable } from '@/components/DataTable/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { departmentColumns, departments } from '@/constants/departments'
import { showDialog } from '@/lib/utils'
import { z } from 'zod'
import { dialogState } from '@/states/dialog'
import { useRecoilValue } from 'recoil'

const Department = () => {
  const dialog = useRecoilValue(dialogState)
  const transformedData = departments.map((depart, idx) => ({
    no: idx + 1,
    ...depart,
  }))

  return (
    <section className="p-5">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Department</h2>
        <Button
          onClick={() =>
            showDialog({
              title: 'Create department',
              defaultValues: {
                name: '',
              },
              formSchema: z.object({
                name: z.string().min(5, { message: 'Must be 5 or more characters long' }),
              }),
              children: (
                <div className="mt-5">
                  <Input.Field name="name" label="Name" />
                </div>
              ),
            })
          }
        >
          Create
        </Button>
      </div>
      <div className="mt-3">
        <DataTable columns={departmentColumns} data={transformedData} />
      </div>
    </section>
  )
}

export default Department
