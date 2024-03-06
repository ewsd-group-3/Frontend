import FilterHeader from '@/components/DataTable/filter-header'
import { Payment } from '@/types/table-type'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Partial<Payment>>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: () => FilterHeader({ title: 'email' }),
  },
  {
    accessorKey: 'amount',
    header: () => FilterHeader({ title: 'hi' }),
  },
]
