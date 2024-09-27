import { useCallback, useEffect, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { Auth0Organization } from '@/pages/api/auth0/user_management_api_v2/organizations/get_organization'
import { AppMessage } from '@/components/message/AppMessage'
import {
  Auth0ConnectionByOrganizationMetadata,
  getConnectionByOrganizationMetadata,
} from '@/utils/auth0/getConnectionByOrganizationMetadata'

interface UseOrganizationState {
  connectionsByOrganizationMetadata: Auth0ConnectionByOrganizationMetadata[]
  loading: boolean;
  updating: boolean;
  organization: Auth0Organization | null
  reload: () => Promise<void>
  updateOrganizationMetadata: (metadata: Record<string, string | null | undefined>) => Promise<void>
}

export const useOrganization = (): UseOrganizationState => {
  const [loading, setLoading] = useState(false)
  const [organization, setOrganization] = useState<Auth0Organization | null>(null)
  const [updating, setUpdating] = useState(false)
  const [connectionsByOrganizationMetadata, setConnectionsByOrganizationMetadata] = useState<Auth0ConnectionByOrganizationMetadata[]>(
    [])

  const reload = useCallback(async(): Promise<void> => {
    try {
      setLoading(true)
      const data = await fetchApi<{ organization: Auth0Organization }>(
        'GET',
        '/auth0/user_management_api_v2/organizations/get_organization',
      )
      setOrganization(data.organization)
      setConnectionsByOrganizationMetadata(getConnectionByOrganizationMetadata(data.organization.metadata))
    } catch (err) {
      AppMessage.addErrorMessage(`Failed to load organization: ${err}`)
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    reload()
  }, [reload])

  const updateOrganizationMetadata = useCallback(async (metadata: Record<string, string | null | undefined>): Promise<void> => {
    try {
      setUpdating(true)
      const data = await fetchApi<{ organization: Auth0Organization }>(
        'PUT',
        '/auth0/user_management_api_v2/organizations/update_organization',
        { metadata: { ...(organization?.metadata ?? {}), ...metadata } },
      )
      setOrganization(data.organization)
      setConnectionsByOrganizationMetadata(getConnectionByOrganizationMetadata(data.organization.metadata))
    } catch (err) {
      AppMessage.addErrorMessage(`Failed to update organization: ${err}`)
    } finally {
      setUpdating(false)
    }
  }, [organization])

  return {
    connectionsByOrganizationMetadata,
    loading,
    organization,
    reload,
    updating,
    updateOrganizationMetadata,
  }
}
