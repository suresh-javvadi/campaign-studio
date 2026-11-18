const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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

export { API_BASE_URL }
