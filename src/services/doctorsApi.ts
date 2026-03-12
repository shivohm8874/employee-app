import { apiGet } from './api'

export type DirectoryDoctor = {
  user_id: string
  full_name?: string
  full_display_name?: string
  avatar_url?: string | null
  rating_avg?: number
  rating_count?: number
  consultation_fee_inr?: number
  doctor_specializations?: Array<{ specialization_name?: string }>
}

export async function fetchDoctors(query?: { search?: string; specialization?: string; verificationStatus?: string; limit?: number }) {
  const params = new URLSearchParams()
  if (query?.search) params.set('search', query.search)
  if (query?.specialization) params.set('specialization', query.specialization)
  if (query?.verificationStatus) params.set('verificationStatus', query.verificationStatus)
  if (query?.limit) params.set('limit', String(query.limit))
  const suffix = params.toString() ? `?${params.toString()}` : ''
  return apiGet<DirectoryDoctor[]>(`/doctors${suffix}`)
}
