import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AddMessage } from '@/hooks/useMessages'

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

    const response = await fetch(`/api/sso_configuration/${type}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ name, signInUrl, x509SigningCert: await x509SigningCert.text() }),
    })
    if (response.ok) {
      const body = await response.text()
      args.addMessage('info', `SSO configuration created successfully: ${body}`)
    } else {
      const { status } = response
      const body = await response.text()
      const errorMessage = `Failed to create SSO configuration: ${status} ${body}`
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
