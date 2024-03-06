import { DataTable } from '@/components/DataTable/data-table'
import { Button } from '@/components/ui/button'
import { departmentColumns, departments } from '@/constants/departments'
import useDialog from '@/hooks/useDialog'
import { useFetch } from '@/hooks/useQuery'
import { showDialog } from '@/lib/utils'
// import { showDialog } from '@/lib/utils'
import { dialogState } from '@/states/dialog'
import React from 'react'
import { useRecoilValue } from 'recoil'

const Staff = () => {
  const dialog = useRecoilValue(dialogState)
  // const { showDialog } = useDialog()

  const transformedData = departments.map((depart, idx) => ({
    no: idx + 1,
    ...depart,
  }))

  const data = useFetch('https://pokeapi.co/api/v2/pokemon/ditto')
  console.log(data.data, 'here')

  return (
    <section className="p-5">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Department</h2>
        <Button
          onClick={() =>
            showDialog({
              title: 'Create department form',
              description: 'This is the description of the dialog',
              children: (
                <div className="mt-5">
                  <p>Testing the children</p>
                  <Button>Click here for button</Button>
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

export default Staff
