import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { Auth0Organization } from '@/pages/api/auth0/user_management_api_v2/organizations/get_organization'

interface UseOrganizationState {
  organization: Auth0Organization | null
  restrictedConnectionIds: string[]
  loading: boolean;
}

export const useOrganization = (): UseOrganizationState => {
  const loading = useRef(true)
  const [organization, setOrganization] = useState<Auth0Organization | null>(null)
  const [restrictedConnectionIds, setRestrictedConnectionIds] = useState<string[]>([])

  useEffect(() => {
    fetchApi<{ organization: Auth0Organization }>(
      'GET',
      '/auth0/user_management_api_v2/organizations/get_organization',
    ).then((data) => {
      loading.current = false
      setOrganization(data.organization)
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

  return {
    organization,
    restrictedConnectionIds,
    loading: loading.current,
  }
}
