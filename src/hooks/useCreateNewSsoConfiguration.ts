import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AddMessage } from '@/hooks/useMessages'
import { fetchApi } from '@/utils/api'

interface FormValues {
  type: string
  name: string
  signInUrl: string
  x509SigningCert: File | null
}

interface UseCreateNewSsoConfigurationArgs {
  addMessage: AddMessage;
}

interface UseCreateNewSsoConfigurationState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

const NamePattern = new RegExp('^[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])*')

export const useCreateNewSsoConfiguration = (args: UseCreateNewSsoConfigurationArgs): UseCreateNewSsoConfigurationState => {
  const [values, setValues] = useState<FormValues>({
    type: 'samlp',
    name: '',
    signInUrl: '',
    x509SigningCert: null,
  })

  const canSubmit: boolean = NamePattern.test(values.name) && values.signInUrl !== '' && values.x509SigningCert !== null
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return

    const { type, name, signInUrl, x509SigningCert } = values
    if (x509SigningCert == null) return

    const response = await fetchApi(
      'POST',
      `/auth0/connections/create/${type}`,
      { name, signInUrl, x509SigningCert: await x509SigningCert.text() },
    )
    args.addMessage('info', `SSO configuration created successfully: ${JSON.stringify(response)}`)
  }

  return {
    canSubmit,
    onSubmit,
    setValues,
    values,
  }
}
