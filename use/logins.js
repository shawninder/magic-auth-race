import useSWR from 'swr'
import jsonFetcher from '../lib/jsonFetcher'

export default function useLogins (ssrLogins) {
  const { data: logins, isValidating, mutate } = useSWR('/api/logins', jsonFetcher(), {
    revalidateOnFocus: false,
    initialData: ssrLogins
  })
  return {
    logins,
    loading: isValidating,
    mutate
  }
}
