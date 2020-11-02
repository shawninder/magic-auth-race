import useSWR from 'swr'
import jsonFetcher from '../lib/jsonFetcher'

function useLoginStats () {
  const { data, isValidating, mutate } = useSWR('/api/loginStats', jsonFetcher('stats'))
  return { loginStats: data, loading: isValidating, mutate }
}

export default useLoginStats
