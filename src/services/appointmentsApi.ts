import { apiPost } from './api'

export async function createAppointment(input: {
  companyId: string
  employeeId: string
  doctorId: string
  createdByUserId: string
  appointmentType: 'teleconsult' | 'opd'
  source?: 'employee_booked' | 'astikan_assigned' | 'doctor_added_patient' | 'freelance_case' | 'admin_created'
  scheduledStart: string
  scheduledEnd: string
  status?: 'scheduled' | 'confirmed' | 'underway' | 'completed' | 'rescheduled' | 'cancelled' | 'no_show'
  reason?: string
  patientSummary?: string
  symptomSnapshot?: Record<string, unknown>
  aiTriageSummary?: string
}) {
  return apiPost<{ appointmentId: string }, typeof input>('/appointments', input)
}
