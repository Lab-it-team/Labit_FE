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

export const updateProfile = async (data: {
  nickname?: string
  profile_image?: string
}): Promise<UserProfile> => {
  const { data: result } = await apiClient.patch<UserProfile>('/users/me', data)
  return result
}

export interface PresignedUploadResponse {
  upload_url: string
  public_url: string
}

type WithdrawalReasonType =
  | 'CONTENT_INSUFFICIENT'
  | 'DIFFICULT_TO_USE'
  | 'FOUND_ALTERNATIVE'
  | 'BUGS_OR_INCONVENIENCE'
  | 'RARELY_USE'
  | 'OTHER'

export const deleteAccount = async (body: {
  reason_type: WithdrawalReasonType
  reason_detail?: string
  confirm_text: string
}): Promise<void> => {
  await apiClient.delete('/users/me', { data: body })
}

export const getPresignedUrl = async (
  contentType: string,
): Promise<PresignedUploadResponse> => {
  const { data } = await apiClient.post<PresignedUploadResponse>(
    '/users/me/profile-image/upload-url',
    { content_type: contentType },
  )
  return data
}
