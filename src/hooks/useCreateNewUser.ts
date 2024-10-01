import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AppMessage } from '@/components/message/AppMessage'
import { fetchApi } from '@/utils/auth0/api'
import { Auth0User } from '@/pages/api/auth0/user_management_api_v2/users/create_user'

interface FormValues {
  connectionName: string;
  email: string
  emailVerified: boolean;
}

interface UseCreateNewUserState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

export const useCreateNewUser = (): UseCreateNewUserState => {
  const [values, setValues] = useState<FormValues>({ connectionName: '', email: '', emailVerified: false })

  const canSubmit: boolean = values.connectionName.trim().length > 0 &&
                             values.email.trim().length > 0 &&
                             values.email.includes('@')
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return
    try {
      const { connectionName, email, emailVerified } = values

      const { user } = await fetchApi<{ user: Auth0User }>(
        'POST',
        'auth0/user_management_api_v2/users/create_user',
        { connectionName, email, emailVerified: emailVerified },
      )

      AppMessage.addInfoMessage(`Created a user: ${JSON.stringify(user)}`)
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
