import useSWR from 'swr'
import jsonFetcher from '../lib/jsonFetcher'

export default function useLogins () {
  const { data: logins, isValidating, mutate } = useSWR('/api/logins', jsonFetcher(), {
    revalidateOnFocus: false
  })
  return {
    logins,
    loading: isValidating,
    mutate
  }
}
