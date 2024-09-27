import {
  Auth0OrganizationConnection,
} from '@/pages/api/auth0/user_management_api_v2/organizations/get_enabled_connections'
import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/auth0/api'
import { AppMessage } from '@/components/message/AppMessage'

interface UseOrganizationConnectionsState {
  connections: Auth0OrganizationConnection[]
  loading: boolean;
}

export const useOrganizationConnections = (): UseOrganizationConnectionsState => {
  const loading = useRef(true)
  const [connections, setConnections] = useState<Auth0OrganizationConnection[]>([])

  useEffect(() => {
    fetchApi<{ connections: Auth0OrganizationConnection[] }>(
      'GET',
      '/auth0/user_management_api_v2/organizations/get_enabled_connections',
    ).then((data) => {
      setConnections(data.connections)
    }).catch((err) => {
      AppMessage.addErrorMessage(`Failed to load connections: ${err}`)
    }).finally(() => {
      loading.current = false
    })
  }, [])

  return {
    connections,
    loading: loading.current,
  }
}
