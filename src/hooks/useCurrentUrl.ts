import { useEffect, useRef, useState } from 'react'

export const useCurrentUrl = (): URL | null => {
  const beforeUrl = useRef<string>('init')
  const [currentUrl, setCurrentUrl] = useState<URL | null>(null)

  useEffect(() => {
    const _window = globalThis.window
    if (_window == null) return
    const intervalId = setInterval(() => {
      const url = new URL(_window.location.href)
      if (url.toString() === beforeUrl.current) return
      beforeUrl.current = url.toString()
      setCurrentUrl(url)
    }, 200)
    return () => clearInterval(intervalId)
  }, [])

  return currentUrl
}
