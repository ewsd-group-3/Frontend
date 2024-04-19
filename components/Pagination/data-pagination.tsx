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

function paginate({ current, max }: { current: number; max: number }) {
  if (!current || !max) return null

  let prev = current === 1 ? null : current - 1
  let next = current === max ? null : current + 1
  let items: [string | number] = [1]

  if (current === 1 && max === 1) return { current, prev, next, items }

  if (current > 2 && max > 3) items.push('...') // Only add ellipsis if max > 3

  let r = 1
  let r1 = current - r
  let r2 = current + r

  for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i)

  if (max > 3 && r2 + 1 < max) items.push('...') // Only add trailing ellipsis if max > 3

  if (r2 < max) items.push(max)

  return { current, prev, next, items }
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

  const pagination = paginate({ current: currentPage, max: totalPage })

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className='cursor-pointer'>
          <PaginationPrevious disabled={currentPage === 1} onClick={() => handleNavigate(currentPage - 1)} />
        </PaginationItem>
        {pagination &&
          pagination.items.map((item, index) => (
            <PaginationItem key={index}>
              {item === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  className='bg-transparent cursor-pointer'
                  isActive={currentPage === item}
                  onClick={() => handleNavigate(item as number)}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        <PaginationItem className='cursor-pointer'>
          <PaginationNext disabled={currentPage === totalPage} onClick={() => handleNavigate(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
