import useSWR from 'swr'
import jsonFetcher from '../lib/jsonFetcher'

export default function useCount () {
  const { data: logins, isValidating, mutate } = useSWR('/api/logins', jsonFetcher())
  console.log('logins', logins)
  return {
    logins,
    loading: isValidating,
    mutate
  }
}
