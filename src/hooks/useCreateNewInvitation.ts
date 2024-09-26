import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { AppMessage } from '@/components/message/AppMessage'

interface FormValues {
  connectionId: string;
  email: string
}

interface UseCreateNewInvitationState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

export const useCreateNewInvitation = (): UseCreateNewInvitationState => {
  const [values, setValues] = useState<FormValues>({ connectionId: '', email: '' })

  const canSubmit: boolean = values.connectionId.trim().length > 0 &&
                             values.email.trim().length > 0 &&
                             values.email.includes('@')
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return
    try {
      const { connectionId, email } = values
      const response = await fetchApi(
        'POST',
        '/auth0/user_management_api_v2/organizations/create_invitation',
        { connectionId, email },
      )
      AppMessage.addErrorMessage(`Invitation has been created: ${JSON.stringify(response)}`)
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
