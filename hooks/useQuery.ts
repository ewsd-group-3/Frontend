import { authState } from '../states/auth'
import request, { Request, Response, ResponseError } from '../lib/requests'
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'

type MutateOptions<TData> = UseMutationOptions<Response<TData>, ResponseError, Request, any> & {
  invalidateUrls?: string[] | string[][]
}

export function useClient() {
  const [token, setToken] = useRecoilState(authState)

  // token.tokens.access
  return useCallback(
    <T = any>(url: string, config?: Request) => {
      return request<T>(url, { token: token?.tokens.access.token, ...config })
        .then(res => res.data)
        .catch(err => {
          if (err?.response?.status === 401) setToken(undefined)

          if (err?.response?.status === 403) throw new Error('unauthorized')

          return err
        })
    },
    [setToken, token?.tokens.access.token],
  )
}

export function useFetch<TData extends any, TIncludeCode extends boolean = false>(
  url: string,
  $config?: Request & { key?: string[]; query?: {}; includeStatusCode?: TIncludeCode },
  options?: UseQueryOptions<
    TIncludeCode extends false ? TData : Response<TData>,
    ResponseError,
    TIncludeCode extends false ? TData : Response<TData>,
    any[]
  >,
) {
  const client = useClient()
  const { key, includeStatusCode = false, ...config } = { ...$config }

  return useQuery(key ? key : [url, config?.payload], fetchConfig => client<TData>(url, { method: 'GET', ...fetchConfig, ...config }), options)
}

export function useMutate<TData extends any>(options?: MutateOptions<TData>) {
  const client = useClient()
  const queryClient = useQueryClient()
  const defaultInvalidateUrls = options?.invalidateUrls || []

  const mutation = useMutation({
    mutationFn: ({ url = '', invalidateUrls = [], awaitInvalidateUrls = [], ...config }) => {
      return client<TData>(url, { method: 'POST', ...config })
        .then(async res => {
          const statusCode = res.statusCode
          if (statusCode) {
            const invalidates = [...invalidateUrls, ...defaultInvalidateUrls]
            for (const v of invalidates) {
              queryClient.invalidateQueries({ queryKey: [v] })
            }
            for (const v of awaitInvalidateUrls) {
              await queryClient.invalidateQueries({ queryKey: [v] })
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
              toast.success(res.message)
            }
            return res
          } else {
            if (res.response.status < 200 || res.response.status >= 300) {
              if (res?.response?.message) {
                toast.error(res.response.message)
              } else {
                return Promise.reject(res)
              }
            } else {
              return res
            }
          }
        })
        .catch(error => {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message)
          }

          if (error.response) {
            return Promise.reject(error.response.data)
          } else {
            return Promise.reject(error)
          }
        })
    },
    ...options,
  })

  return mutation
}
