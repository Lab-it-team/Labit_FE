import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { kakaoLogin } from './api'
import { useAuthStore } from '@/stores/authStore'

export const useKakaoLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: kakaoLogin,
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken)
      navigate('/')
    },
  })
}
