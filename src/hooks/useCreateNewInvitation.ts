import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AddMessage } from '@/hooks/useMessages'

interface FormValues {
  connectionId: string;
  email: string
}

interface UseCreateNewInvitationArgs {
  addMessage: AddMessage;
}

interface UseCreateNewInvitationState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

export const useCreateNewInvitation = (args: UseCreateNewInvitationArgs): UseCreateNewInvitationState => {
  const [values, setValues] = useState<FormValues>({ connectionId: '', email: '' })

  const canSubmit: boolean = values.email.trim().length > 0 && values.email.includes('@')
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return
    const { connectionId, email } = values

    const response = await fetch(`/api/invitation/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ connectionId, email }),
    })
    if (response.ok) {
      const body = await response.text()
      args.addMessage('info', `Invitation has been created: ${body}`)
    } else {
      const { status } = response
      const body = await response.text()
      const errorMessage = `Failed to create an invitation: ${status} ${body}`
      args.addMessage('error', errorMessage)
    }
  }

  return {
    canSubmit,
    onSubmit,
    setValues,
    values,
  }
}
