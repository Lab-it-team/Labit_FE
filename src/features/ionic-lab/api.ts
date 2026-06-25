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
  cation_id: string,
  anion_id: string,
): Promise<IonicCompoundResponse> => {
  const { data } = await apiClient.get<IonicCompoundResponse>('/ionic-compounds', {
    params: { cation_id, anion_id },
  })
  return data
}
