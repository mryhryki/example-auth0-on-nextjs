import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AddMessage } from '@/hooks/useMessages'
import { fetchApi } from '@/utils/api'

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

  const canSubmit: boolean = values.connectionId.trim().length > 0 &&
                             values.email.trim().length > 0 &&
                             values.email.includes('@')
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return
    const { connectionId, email } = values

    const response = await fetchApi(
      'POST',
      '/auth0/user_management_api_v2/organizations/create_invitation',
      { connectionId, email },
    )
    args.addMessage('info', `Invitation has been created: ${JSON.stringify(response)}`)
  }

  return {
    canSubmit,
    onSubmit,
    setValues,
    values,
  }
}
