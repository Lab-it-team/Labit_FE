import { apiClient } from '@/lib/axios'
import type { HomeResponse, ProgressStatus } from '@/types'

export const getUnits = async (): Promise<HomeResponse> => {
  const { data } = await apiClient.get<HomeResponse>('/learning/units')
  return data
}

export const updateLessonProgress = async (
  lessonId: number,
  status: ProgressStatus,
): Promise<void> => {
  await apiClient.patch(`/learning/lessons/${lessonId}/progress`, { status })
}
