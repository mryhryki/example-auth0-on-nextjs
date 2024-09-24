import { useEffect, useState } from 'react'

export const useCurrentUrl = (): URL | null => {
  const [currentUrl, setCurrentUrl] = useState<URL | null>(null)

  useEffect(() => {
    const _window = globalThis.window
    if (_window == null) return
    setCurrentUrl(new URL(_window.location.href))
  }, [])

  return currentUrl
}
