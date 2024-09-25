import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AddErrorMessage } from '@/hooks/useErrorMessages'

interface FormValues {
  type: string
  name: string
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
    type: 'saml',
    name: '',
    signInUrl: '',
    x509SigningCert: null,
  })

  const canSubmit: boolean = values.name !== '' && values.signInUrl !== '' && values.x509SigningCert !== null
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return

    const { type, name, signInUrl, x509SigningCert } = values
    if (x509SigningCert == null) return

    const formData = new FormData()
    formData.append('type', type)
    formData.append('name', name)
    formData.append('signInUrl', signInUrl)
    formData.append('x509SigningCert', x509SigningCert)

    const response = await fetch('/api/sso_configuration', {
      method: 'POST',
      body: formData,
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
