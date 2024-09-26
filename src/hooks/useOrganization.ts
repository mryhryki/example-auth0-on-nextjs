import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { Auth0Organization } from '@/pages/api/auth0/user_management_api_v2/organizations/get_organization'

interface UseOrganizationState {
  organization: Auth0Organization | null
  restrictedConnectionIds: string[]
  loading: boolean;
  reload: () => Promise<void>
}

export const useOrganization = (): UseOrganizationState => {
  const [loading, setLoading] = useState(false)
  const [organization, setOrganization] = useState<Auth0Organization | null>(null)
  const [restrictedConnectionIds, setRestrictedConnectionIds] = useState<string[]>([])

  const reload = useCallback(async(): Promise<void> => {
    await fetchApi<{ organization: Auth0Organization }>(
      'GET',
      '/auth0/user_management_api_v2/organizations/get_organization',
    ).then((data) => {
      setOrganization(data.organization)
      setLoading(false)
      try {
        const ids = JSON.parse(data.organization.metadata?.restrictedConnectionIds ?? '[]')
        if (Array.isArray(ids)) {
          setRestrictedConnectionIds(ids)
          return
        }
        console.warn('restrictedConnectionIds is not an array:', data.organization.metadata?.restrictedConnectionIds)
      } catch (err) {
        console.warn(err)
      }
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return {
    organization,
    restrictedConnectionIds,
    reload,
    loading,
  }
}
