import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { AppMessage } from '@/components/message/AppMessage'

interface FormValues {
  type: string
  name: string
  displayName: string
  signInUrl: string
  x509SigningCert: File | null
}

interface UseCreateNewSsoConfigurationState {
  canSubmit: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setValues: Dispatch<SetStateAction<FormValues>>
  values: FormValues
}

const NamePattern = new RegExp('^[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])*')

export const useCreateNewSsoConfiguration = (): UseCreateNewSsoConfigurationState => {
  const [values, setValues] = useState<FormValues>({
    type: 'samlp',
    name: '',
    displayName: '',
    signInUrl: '',
    x509SigningCert: null,
  })

  const canSubmit: boolean = NamePattern.test(values.name) && values.displayName !== '' && values.signInUrl !== '' && values.x509SigningCert !== null
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return

    try {
     const { type, name, signInUrl, x509SigningCert } = values
     if (x509SigningCert == null) return
      const response = await fetchApi(
        'POST',
        `/auth0/user_management_api_v2/connections/create/${type}`,
        { name, signInUrl, x509SigningCert: await x509SigningCert.text() },
      )
      AppMessage.addInfoMessage(`SSO configuration created successfully: ${JSON.stringify(response)}`)
    } catch (err) {
      AppMessage.addErrorMessage(`Failed to create SSO configuration: ${err}`)
    }
  }

  return {
    canSubmit,
    onSubmit,
    setValues,
    values,
  }
}
