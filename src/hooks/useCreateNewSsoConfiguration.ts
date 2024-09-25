import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AddErrorMessage } from '@/hooks/useErrorMessages'

interface FormValues {
  type: string
  displayName: string
  signInUrl: string
  x509SigningCert: File | null
}

interface UseCreateNewSsoConfigurationArgs {
  addErrorMessage: AddErrorMessage
}

interface UseCreateNewSsoConfigurationState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

export const useCreateNewSsoConfiguration = (args: UseCreateNewSsoConfigurationArgs): UseCreateNewSsoConfigurationState => {
  const [values, setValues] = useState<FormValues>({
    type: 'samlp',
    displayName: '',
    signInUrl: '',
    x509SigningCert: null,
  })

  const canSubmit: boolean = values.displayName !== '' && values.signInUrl !== '' && values.x509SigningCert !== null
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return

    const { type, signInUrl, x509SigningCert } = values
    if (x509SigningCert == null) return

    const response = await fetch(`/api/sso_configuration/${type}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ signInUrl, x509SigningCert: await x509SigningCert.text() }),
    })
    if (!response.ok) {
      const { status } = response
      const body = await response.text()
      const errorMessage = `Failed to create SSO configuration: ${status} ${body}`
      args.addErrorMessage(errorMessage)
    }
  }

  return {
    canSubmit,
    onSubmit,
    setValues,
    values,
  }
}
