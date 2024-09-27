export const fetchApi = async<T>(method: string, path: string, payload: unknown = {}): Promise<T> => {
  const body = method === 'GET' ? undefined : JSON.stringify(payload)
  const response = await fetch(`/api/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} => ${await response.text()}`)
  }
  return response.json()
}
