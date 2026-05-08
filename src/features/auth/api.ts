import { apiClient } from '@/lib/axios'

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export const kakaoLogin = async (code: string): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>('/auth/kakao', { code })
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
