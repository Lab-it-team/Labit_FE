import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUnits, updateLessonProgress } from '@/features/learning/api'
import type { ProgressStatus } from '@/types'

export const useUnits = () =>
  useQuery({
    queryKey: ['learning', 'units'],
    queryFn: getUnits,
  })

export const useUpdateLessonProgress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, status }: { lessonId: number; status: ProgressStatus }) =>
      updateLessonProgress(lessonId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning', 'units'] }),
  })
}
