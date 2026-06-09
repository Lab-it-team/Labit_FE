import { apiClient } from '@/lib/axios'
import type {
  QuizResponse,
  QuizAnswerRequest,
  QuizResultResponse,
  QuizResultDetailResponse,
} from '@/types'

export const getQuizzes = async (): Promise<QuizResponse[]> => {
  const { data } = await apiClient.get<QuizResponse[]>('/quizzes')
  return data
}

export const submitQuiz = async (answers: QuizAnswerRequest[]): Promise<QuizResultResponse> => {
  const { data } = await apiClient.post<QuizResultResponse>('/quizzes/submit', { answers })
  return data
}

export const getResults = async (): Promise<QuizResultResponse[]> => {
  const { data } = await apiClient.get<QuizResultResponse[]>('/quizzes/results')
  return data
}

export const getResultDetail = async (resultId: number): Promise<QuizResultDetailResponse> => {
  const { data } = await apiClient.get<QuizResultDetailResponse>(`/quizzes/results/${resultId}`)
  return data
}
