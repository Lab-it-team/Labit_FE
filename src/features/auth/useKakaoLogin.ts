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
      // 실습 화면에서 로그인한 경우가 아니면 이전 실습 데이터를 초기화
      const hasPreLoginState =
        sessionStorage.getItem('lab_pre_login_placed_pieces') !== null ||
        sessionStorage.getItem('lab_pre_login_solved_problems') !== null
      if (!hasPreLoginState) {
        sessionStorage.removeItem('lab_placed_pieces')
        sessionStorage.removeItem('lab_solved_problems')
      }
      navigate(redirect)
    },
  })
}
