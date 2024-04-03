import { useRouter } from 'next/router'
import { useFetch } from './useQuery'

export function useFetchListing<TData>(
  url: string,
  defaultKeys: { sortBy?: string; sortType?: string; page?: string; limit?: number } = {
    sortBy: 'id',
    sortType: 'asc',
    page: '1',
    limit: 5,
  },
) {
  const router = useRouter()
  const sortBy = (router.query.sortBy ?? defaultKeys.sortBy) as string
  const sortType = (router.query.sortType ?? defaultKeys.sortType) as string
  const page = (router.query.page ?? defaultKeys.page) as string
  const limit = (router.query.limit ?? defaultKeys.limit) as number

  const apiUrl = `${url}${url.includes('?') ? '&' : '?'}sortBy=${sortBy}&sortType=${sortType}&page=${page}&limit=${limit}`

  const { data, isLoading, refetch, error } = useFetch<TData, true>(
    apiUrl,
    {
      key: [url, { sortBy, sortType, page }] as any,
    },
    {
      keepPreviousData: true,
    },
  )

  if (error?.message === 'unauthorized') {
    throw new Error('unauthorized')
  }

  return { data, isLoading, refetch, error }
}
