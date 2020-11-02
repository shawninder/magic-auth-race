import useSWR from 'swr'
import jsonFetcher from '../lib/jsonFetcher'

export default function useUser () {
  const { data, isValidating } = useSWR('/api/user', jsonFetcher())
  return {
    user: (data && data.user) || null,
    logins: (data && data.logins) || null,
    loading: isValidating
  }
}
