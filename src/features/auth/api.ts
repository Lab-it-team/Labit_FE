import { apiClient } from '@/lib/axios'

export interface KakaoLoginResponse {
  user: {
    id: string
    nickname: string
    profileImage?: string
  }
  accessToken: string
}

export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const { data } = await apiClient.post<KakaoLoginResponse>('/auth/kakao', { code })
  return data
}
