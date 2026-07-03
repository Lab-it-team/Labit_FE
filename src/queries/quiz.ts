import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuizzes, submitQuiz, getResults, getResultDetail } from '@/features/quiz/api'
import type { QuizAnswerRequest } from '@/types'

export const useQuizzes = () =>
  useQuery({
    queryKey: ['quizzes'],
    queryFn: getQuizzes,
  })

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (answers: QuizAnswerRequest[]) => submitQuiz(answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'results'] })
    },
  })
}

export const useResults = () =>
  useQuery({
    queryKey: ['quizzes', 'results'],
    queryFn: getResults,
  })

export const useResultDetail = (resultId: number | null) =>
  useQuery({
    queryKey: ['quizzes', 'results', resultId],
    queryFn: () => getResultDetail(resultId!),
    enabled: resultId !== null,
  })
