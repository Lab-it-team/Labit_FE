import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/features/auth/api'

export const useMe = () =>
  useQuery({
    queryKey: ['users', 'me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  })
