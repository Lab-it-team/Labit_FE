import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useKakaoLogin } from '@/features/auth/useKakaoLogin'

export default function KakaoCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate: loginWithKakao } = useKakaoLogin()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error || !code) {
      navigate('/login', { replace: true })
      return
    }

    loginWithKakao(code)
  }, [])

  return null
}
