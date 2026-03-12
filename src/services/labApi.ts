import { apiGet, apiPost } from './api'

export type LabCatalogTest = {
  id: string
  code: string
  name: string
  reportingTime: string
  price: number | null
  category: string
}

type LabCatalogResponse = {
  keyword: string
  total: number
  categories: Array<{ name: string; count: number }>
  tests: LabCatalogTest[]
}

const CACHE_PREFIX = 'lab-catalog:'

function cacheKey(keyword = '', limit = 10, offset = 0) {
  return `${CACHE_PREFIX}${keyword.trim().toLowerCase() || '__all__'}:${limit}:${offset}`
}

function readCache(keyword = '', limit = 10, offset = 0) {
  const raw = sessionStorage.getItem(cacheKey(keyword, limit, offset))
  if (!raw) return null
  try {
    return JSON.parse(raw) as LabCatalogResponse
  } catch {
    sessionStorage.removeItem(cacheKey(keyword, limit, offset))
    return null
  }
}

function writeCache(keyword: string, limit: number, offset: number, payload: LabCatalogResponse) {
  sessionStorage.setItem(cacheKey(keyword, limit, offset), JSON.stringify(payload))
}

export function getCachedLabCatalog(keyword = '', limit = 10, offset = 0) {
  return readCache(keyword, limit, offset)
}

export async function getLabCatalog(keyword = '', limit = 10, offset = 0, _signal?: AbortSignal) {
  const data = await apiGet<LabCatalogResponse>(`/lab/catalog?keyword=${encodeURIComponent(keyword)}&limit=${limit}&offset=${offset}`)
  writeCache(keyword, limit, offset, data)
  return data
}

export async function preloadLabCatalog(keyword = '', limit = 10, offset = 0) {
  const cached = readCache(keyword, limit, offset)
  if (cached) return cached
  return getLabCatalog(keyword, limit, offset)
}

export async function warmLabCatalogSearchIndex() {
  await Promise.all([
    preloadLabCatalog('', 10, 0),
    preloadLabCatalog('cbc', 10, 0),
    preloadLabCatalog('thyroid', 10, 0),
    preloadLabCatalog('glucose', 10, 0),
  ])
}

export async function bookLabOrder(input: Record<string, unknown>) {
  return apiPost<Record<string, unknown>, Record<string, unknown>>('/lab/book-order', input)
}
