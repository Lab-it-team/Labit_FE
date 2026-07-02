import { apiClient } from '@/lib/axios'

export type ContactCategory = 'GENERAL' | 'BUG' | 'FEATURE' | 'ACCOUNT_PAYMENT' | 'OTHER'

interface ContactRequest {
  category: ContactCategory
  email: string
  title?: string
  message: string
}

interface ContactResponse {
  success: boolean
  message: string
}

export const submitContact = async (body: ContactRequest): Promise<ContactResponse> => {
  const { data } = await apiClient.post<ContactResponse>('/contact', body)
  return data
}
