import useSWR from 'swr'
import jsonFetcher from '../lib/jsonFetcher'

export default function useCount () {
  const { data: logins, isValidating, mutate } = useSWR('/api/logins', jsonFetcher())
  return {
    logins,
    loading: isValidating,
    mutate
  }
}
