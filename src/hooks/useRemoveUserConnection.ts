import { useCallback, useState } from 'react'
import { AppMessage } from '@/components/message/AppMessage'
import { fetchApi } from '@/utils/auth0/api'

type RemoveUserConnection = (userId: string, connectionName: string) => Promise<void>

interface UseRemoveUserConnectionState {
  loading: boolean;
  removeUserConnection: RemoveUserConnection
}

export const useRemoveUserConnection = (): UseRemoveUserConnectionState => {
  const [loading, setLoading] = useState(false)
  const removeUserConnection: RemoveUserConnection = useCallback(async (
    userId: string,
    connectionName: string,
  ): Promise<void> => {
    try {
      setLoading(true)
      const response = await fetchApi(
        'DELETE',
        '/auth0/user_management_api_v2/users/remove_connection',
        { userId, connectionName },
      )
      AppMessage.addInfoMessage(`Removed user connection: ${JSON.stringify(response)}`)
    } catch (err) {
      AppMessage.addErrorMessage(`Failed to remove user connection: ${err}`)
    } finally {
      setLoading(false)
    }

  }, [setLoading])

  return {
    loading,
    removeUserConnection,
  }
}
