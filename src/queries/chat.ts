import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSessions,
  createSession,
  deleteSession,
  sendMessage,
  getMessages,
} from '@/features/chat/api'

export const useSessions = () =>
  useQuery({
    queryKey: ['chats', 'sessions'],
    queryFn: getSessions,
  })

export const useCreateSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chats', 'sessions'] }),
  })
}

export const useDeleteSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: number) => deleteSession(sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chats', 'sessions'] }),
  })
}

export const useSendMessage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      content,
      context,
    }: {
      sessionId: number
      content: string
      context?: string | null
    }) => sendMessage(sessionId, content, context),
    onSuccess: (_, { sessionId }) =>
      qc.invalidateQueries({ queryKey: ['chats', 'sessions', sessionId, 'messages'] }),
  })
}

export const useMessages = (sessionId: number | null) =>
  useQuery({
    queryKey: ['chats', 'sessions', sessionId, 'messages'],
    queryFn: () => getMessages(sessionId!),
    enabled: sessionId !== null,
  })
