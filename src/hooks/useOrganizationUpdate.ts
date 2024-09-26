import { useCallback, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { Auth0Organization } from '@/pages/api/auth0/user_management_api_v2/organizations/get_organization'
import { AppMessage } from '@/components/message/AppMessage'

interface UpdateOrganizationParams {
  metadata: Record<string, string>
}

interface UseOrganizationState {
  loading: boolean;
  updateOrganization: (params: UpdateOrganizationParams) => Promise<void>
}

export const useOrganizationUpdate = (): UseOrganizationState => {
  const [loading, setLoading] = useState(false)

  const updateOrganization = useCallback(async (params: UpdateOrganizationParams): Promise<void> => {
    try {
      setLoading(true)
      await fetchApi<{ organization: Auth0Organization }>(
        'PUT',
        '/auth0/user_management_api_v2/organizations/update_organization',
        params,
      )

    } catch (err) {
      AppMessage.addErrorMessage(`Failed to update organization: ${err}`)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    updateOrganization,
    loading,
  }
}
