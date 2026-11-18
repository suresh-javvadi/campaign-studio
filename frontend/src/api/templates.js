import { request } from './client.js'

export function listTemplates({ category, partyTag, q } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (partyTag) params.set('partyTag', partyTag)
  if (q) params.set('q', q)
  const query = params.toString()
  return request(`/api/templates${query ? `?${query}` : ''}`)
}

export function getTemplateFilters() {
  return request('/api/templates/categories')
}

export function getTemplate(id) {
  return request(`/api/templates/${id}`)
}
