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
      const redirect = sessionStorage.getItem('lab_redirect') ?? '/home';
      sessionStorage.removeItem('lab_redirect');
      // 실습 화면(이온/공유 결합 등)에서 로그인한 경우가 아니면 그 실습의 이전 데이터를 초기화
      const storagePrefix = sessionStorage.getItem('kakao_login_storage_prefix')
      sessionStorage.removeItem('kakao_login_storage_prefix')
      if (storagePrefix) {
        const hasPreLoginState =
          sessionStorage.getItem(`${storagePrefix}_pre_login_placed_pieces`) !== null ||
          sessionStorage.getItem(`${storagePrefix}_pre_login_solved_problems`) !== null
        if (!hasPreLoginState) {
          sessionStorage.removeItem(`${storagePrefix}_placed_pieces`)
          sessionStorage.removeItem(`${storagePrefix}_solved_problems`)
        }
      }
      navigate(redirect)
    },
  })
}
