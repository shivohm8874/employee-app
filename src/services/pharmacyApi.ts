import { apiPost } from './api'

export async function createPharmacyOrder(input: {
  companyReference?: string
  companyName?: string
  employee?: { email?: string; phone?: string; fullName?: string; handle?: string; employeeCode?: string }
  doctor?: { email?: string; phone?: string; fullName?: string; handle?: string }
  patientId?: string
  orderSource: 'doctor_store' | 'employee_store' | 'admin_panel'
  subtotalInr: number
  walletUsedInr?: number
  onlinePaymentInr?: number
  creditCost?: number
  shippingAddress?: Record<string, unknown>
  items: Array<{
    sku?: string
    productId?: string
    name: string
    category?: string
    description?: string
    price: number
    quantity: number
    imageUrls?: string[]
  }>
}) {
  return apiPost<{ orderId: string; companyId: string }, typeof input>('/pharmacy/orders', input)
}
