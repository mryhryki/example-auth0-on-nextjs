import {
  Auth0OrganizationConnection,
} from '@/pages/api/auth0/user_management_api_v2/organizations/get_enabled_connections'
import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/api'

interface UseOrganizationMembersState {
  users: Auth0OrganizationConnection[]
  loading: boolean;
}

export const useOrganizationMembers = (): UseOrganizationMembersState => {
  const loading = useRef(true)
  const [connections, setConnections] = useState<Auth0OrganizationConnection[]>([])

  useEffect(() => {
    fetchApi<{ connections: Auth0OrganizationConnection[] }>(
      'GET',
      '/auth0/user_management_api_v2/organizations/get_enabled_connections',
    ).then((data) => {
      loading.current = false
      setConnections(data.connections)
    })
  }, [])

  return {
    connections,
    loading: loading.current,
  }
}
