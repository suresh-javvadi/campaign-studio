import { API_BASE_URL } from './client.js'

/**
 * Uploads a file to the backend's storage layer and returns the absolute
 * URL it can be loaded from. The backend returns a storage-relative path
 * today (local disk); if that ever changes to an already-absolute URL
 * (e.g. S3), it's passed through unchanged.
 */
export async function uploadImageFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/uploads`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    let message = `Upload failed with status ${response.status}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // response body wasn't JSON — keep the generic message
    }
    throw new Error(message)
  }

  const { url } = await response.json()
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`
}
