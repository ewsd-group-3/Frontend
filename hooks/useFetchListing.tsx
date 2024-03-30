import { useRouter } from 'next/router'
import { useFetch } from './useQuery'

export function useFetchListing<TData>(
  url: string,
  defaultKeys: { sortBy?: string; sortType?: string; page?: string } = {
    sortBy: 'id',
    sortType: 'asc',
    page: '1',
  },
) {
  const router = useRouter()
  const sortBy = (router.query.sortBy ?? defaultKeys.sortBy) as string
  const sortType = (router.query.sortType ?? defaultKeys.sortType) as string
  const page = (router.query.page ?? defaultKeys.page) as string

  const apiUrl = `${url}${url.includes('?') ? '&' : '?'}sortBy=${sortBy}&sortType=${sortType}&page=${page}`
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
