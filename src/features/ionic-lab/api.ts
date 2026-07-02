import { apiClient } from '@/lib/axios'

export interface IonicCompoundResponse {
  exists: boolean
  formula: string | null
  name_ko: string | null
  common_name: string | null
  color: string | null
  solubility: string | null
  notes: string | null
  reason_if_not: string | null
}

export const getIonicCompound = async (
  cationId: string,
  anionId: string,
): Promise<IonicCompoundResponse> => {
  const { data } = await apiClient.get<IonicCompoundResponse>('/ionic-compounds', {
    params: { cation_id: cationId, anion_id: anionId },
  })
  return data
}
