import { useCallback, useState } from 'react'

export type MessageType = 'info' | 'error'

export interface MessageInfo {
  id: string
  type: MessageType
  message: string
}

export type AddMessage = (type: MessageType, message: string) => void
export type RemoveMessage = (id: string) => void

interface UseErrorMessagesState {
  errorMessages: MessageInfo[]
  addMessage: AddMessage
  removeMessage: RemoveMessage
}

export const useMessages = (): UseErrorMessagesState => {
  const [errorMessages, setErrorMessages] = useState<MessageInfo[]>([])

  const addMessage = useCallback((type: MessageType, message: string): void => {
    const id = crypto.randomUUID()
    setErrorMessages((prev) => [{ id, type, message }, ...prev])
  }, [setErrorMessages])

  const removeMessage = useCallback((id: string): void => {
    setErrorMessages((prev) => prev.filter((error) => error.id !== id))
  }, [setErrorMessages])

  return {
    errorMessages,
    addMessage,
    removeMessage,
  }
}

