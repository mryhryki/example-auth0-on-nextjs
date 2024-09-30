import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AppMessage } from '@/components/message/AppMessage'

interface FormValues {
  connectionId: string;
  email: string
}

interface UseCreateNewUserState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

export const useCreateNewUser = (): UseCreateNewUserState => {
  const [values, setValues] = useState<FormValues>({ connectionId: '', email: '' })

  const canSubmit: boolean = values.connectionId.trim().length > 0 &&
                             values.email.trim().length > 0 &&
                             values.email.includes('@')
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return
    try {
      const { connectionId, email } = values

      alert('TODO: create a user')

      AppMessage.addInfoMessage(`Created a user: ${JSON.stringify({ connectionId, email })}`)
    } catch (err) {
      AppMessage.addErrorMessage(`Failed to create invitation: ${err}`)
    }
  }

  return {
    canSubmit,
    onSubmit,
    setValues,
    values,
  }
}
