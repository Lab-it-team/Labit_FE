import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useKakaoLogin } from '@/features/auth/useKakaoLogin'

export default function KakaoCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate: loginWithKakao } = useKakaoLogin()
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current) return
    attempted.current = true

    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')
    const savedState = sessionStorage.getItem('kakao_oauth_state')

    if (error || !code || !state || state !== savedState) {
      navigate('/login', { replace: true })
      return
    }

    sessionStorage.removeItem('kakao_oauth_state')
    loginWithKakao(code, {
      onError: () => navigate('/login', { replace: true }),
    })
  }, [searchParams, navigate, loginWithKakao])

  return null
}
