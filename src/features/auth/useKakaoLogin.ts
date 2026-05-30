import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { kakaoLogin, getMe } from './api'
import { useAuthStore } from '@/stores/authStore'

export const useKakaoLogin = () => {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: kakaoLogin,
    onSuccess: async ({ access_token, refresh_token }) => {
      setTokens(access_token, refresh_token)
      try {
        const me = await getMe()
        setUser({ nickname: me.nickname, profileImageUrl: me.profile_image })
      } catch {
        // 프로필 조회 실패해도 로그인은 유지
      }
      const redirect = sessionStorage.getItem('lab_redirect') ?? '/';
      sessionStorage.removeItem('lab_redirect');
      navigate(redirect)
    },
  })
}
