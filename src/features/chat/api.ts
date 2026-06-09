import { apiClient } from '@/lib/axios'
import type { ChatSessionResponse, ChatMessageResponse, ChatResponse } from '@/types'

export const getSessions = async (): Promise<ChatSessionResponse[]> => {
  const { data } = await apiClient.get<ChatSessionResponse[]>('/chats/sessions')
  return data
}

export const createSession = async (): Promise<ChatSessionResponse> => {
  const { data } = await apiClient.post<ChatSessionResponse>('/chats/sessions')
  return data
}

export const deleteSession = async (sessionId: number): Promise<void> => {
  await apiClient.delete(`/chats/sessions/${sessionId}`)
}

export const sendMessage = async (
  sessionId: number,
  content: string,
  context?: string | null,
): Promise<ChatResponse> => {
  const { data } = await apiClient.post<ChatResponse>(
    `/chats/sessions/${sessionId}/messages`,
    { content, context: context ?? null },
  )
  return data
}

export const getMessages = async (sessionId: number): Promise<ChatMessageResponse[]> => {
  const { data } = await apiClient.get<ChatMessageResponse[]>(
    `/chats/sessions/${sessionId}/messages`,
  )
  return data
}
