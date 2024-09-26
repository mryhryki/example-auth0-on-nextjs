import {
  Auth0OrganizationConnection,
} from '@/pages/api/auth0/user_management_api_v2/organizations/get_enabled_connections'
import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/api'

interface UseOrganizationConnectionArgs {
  connectionId: string
}

interface UseOrganizationConnectionState {
  connection: Auth0OrganizationConnection | null
  loading: boolean;
}

export const useOrganizationConnection = (args: UseOrganizationConnectionArgs): UseOrganizationConnectionState => {
  const { connectionId } = args

  const loading = useRef(true)
  const [connection, setConnection] = useState<Auth0OrganizationConnection | null>(null)

  useEffect(() => {
    fetchApi<{ connection: Auth0OrganizationConnection }>(
      'GET',
      `/auth0/user_management_api_v2/organizations/get_enabled_connection?connectionId=${connectionId}`,
    ).then((data) => {
      loading.current = false
      setConnection(data.connection)
    })
  }, [connectionId])

  return {
    connection,
    loading: loading.current,
  }
}
