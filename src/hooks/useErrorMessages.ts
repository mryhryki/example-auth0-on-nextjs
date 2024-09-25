import { useCallback, useState } from 'react'

export interface ErrorMessage {
  id: string
  message: string
}

export type AddErrorMessage = (message: string) => void
export type RemoveErrorMessage = (id: string) => void

interface UseErrorMessagesState {
  errorMessages: ErrorMessage[]
  addErrorMessage: AddErrorMessage
  removeErrorMessage: RemoveErrorMessage
}

export const useErrorMessages = (): UseErrorMessagesState => {
  const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([])

  const addErrorMessage = useCallback((message: string): void => {
    const id = crypto.randomUUID()
    setErrorMessages((prev) => [{ id, message }, ...prev])
  }, [setErrorMessages])

  const removeErrorMessage = useCallback((id: string): void => {
    setErrorMessages((prev) => prev.filter((error) => error.id !== id))
  }, [setErrorMessages])

  return {
    errorMessages,
    addErrorMessage,
    removeErrorMessage,
  }
}

