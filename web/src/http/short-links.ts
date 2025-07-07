import axios from "axios"
import { type CreateShortLink, type ShortLink } from "@/types/short-links"
import { API_URL } from "@/utils/constants"

const api = axios.create({
  baseURL: API_URL ?? '/api'
})

export async function listShortLinks(): Promise<ShortLink[]> {
  const response = await api.get<ShortLink[]>('/links')
  return response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createShortLink(data: CreateShortLink): Promise<{ id: string }> {
  const response = await api.post<{ id: string }>('/links', data)
  return response.data
}

export async function deleteShortLink(slug: string): Promise<void> {
  await api.delete(`/links/${slug}`)
}

export async function getOriginalLinkBySlug(slug: string): Promise<{ originalUrl: string }> {
  const response = await api.get<{ originalUrl: string }>(`/links/${slug}`)
  return response.data
}

export async function exportShortLinksCsv(): Promise<{ exportUrl: string }> {
  const response = await api.post<{ exportUrl: string }>(`/links/export`)
  return response.data
}
