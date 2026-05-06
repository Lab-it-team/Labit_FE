import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { kakaoLogin } from './api'
import { useAuthStore } from '@/stores/authStore'

export const useKakaoLogin = () => {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)

  return useMutation({
    mutationFn: kakaoLogin,
    onSuccess: ({ access_token, refresh_token }) => {
      setTokens(access_token, refresh_token)
      navigate('/')
    },
  })
}
