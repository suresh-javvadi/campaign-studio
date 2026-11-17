const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // response body wasn't JSON — keep the generic message
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export function listProjects() {
  return request('/api/projects')
}

export function getProject(id) {
  return request(`/api/projects/${id}`)
}

export function createProject(payload) {
  return request('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateProject(id, payload) {
  return request(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteProject(id) {
  return request(`/api/projects/${id}`, { method: 'DELETE' })
}
