import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { fetchApi } from '@/utils/auth0/api'
import { AppMessage } from '@/components/message/AppMessage'

interface FormValues {
  connectionId: string;
  userId: string
}

interface UseCreateNewInvitationState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

export const useCreateNewInvitation = (): UseCreateNewInvitationState => {
  const [values, setValues] = useState<FormValues>({ connectionId: '', userId: '' })

  const canSubmit: boolean = values.connectionId.trim().length > 0 && values.userId.startsWith('auth0|')
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return
    try {
      const { connectionId, userId } = values
      const response = await fetchApi(
        'POST',
        '/auth0/user_management_api_v2/organizations/create_invitation',
        { connectionId, userId },
      )
      AppMessage.addInfoMessage(`Invitation has been created: ${JSON.stringify(response)}`)
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
