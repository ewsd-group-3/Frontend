import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useRouter } from 'next/router'

interface DataPaginationProps {
  totalPage: number
  currentPage: number
}

export default function DataPagination({ currentPage, totalPage }: DataPaginationProps) {
  const router = useRouter()
  const handleNavigate = (newPage: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: newPage,
      },
    })
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className='cursor-pointer'>
          <PaginationPrevious disabled={currentPage === 1} onClick={() => handleNavigate(currentPage - 1)} />
        </PaginationItem>
        {Array.from({ length: totalPage }, (_, i) => (
          <PaginationItem className='cursor-pointer' key={i}>
            <PaginationLink isActive={currentPage === i + 1} onClick={() => handleNavigate(i + 1)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem className='cursor-pointer'>
          <PaginationNext disabled={currentPage === totalPage} onClick={() => handleNavigate(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
