import { apiClient } from '@/lib/axios'

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  profile_image: string | null
  created_at: string
  updated_at: string
}

export const getMe = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>('/users/me')
  return data
}

export const kakaoLogin = async (code: string): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>('/auth/kakao', {
    code,
    redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
  })
  return data
}

export const refreshTokens = async (refreshToken: string): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  })
  return data
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}
