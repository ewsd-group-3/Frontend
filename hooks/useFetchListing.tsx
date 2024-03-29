import { useRouter } from 'next/router'
import { useFetch } from './useQuery'

export function useFetchListing<TData>(url: string, limit?: number) {
  const router = useRouter()
  const sortBy = (router.query.sortBy || 'id') as string
  const sortType = (router.query.sortType ?? 'asc') as string
  const page = (router.query.page ?? '1') as string

  const apiUrl = `${url}${url.includes('?') ? '&' : '?'}sortBy=${sortBy}&sortType=${sortType}&page=${page}&limit=${limit ?? 5}`

  const { data, isLoading, refetch } = useFetch<TData, true>(
    apiUrl,
    {
      key: [url, { sortBy, sortType, page }] as any,
    },
    {
      keepPreviousData: true,
    },
  )
  return { data, isLoading, refetch }
}
