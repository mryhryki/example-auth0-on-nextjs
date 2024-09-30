import { useCallback, useState } from 'react'
import { AppMessage } from '@/components/message/AppMessage'
import { fetchApi } from '@/utils/auth0/api'

type RemoveUserConnection = (primaryUserAccountId: string, provider: string, secondaryLinkedAccountId: string) => Promise<void>

interface UseRemoveUserConnectionState {
  loading: boolean;
  removeUserConnection: RemoveUserConnection
}

export const useRemoveUserConnection = (): UseRemoveUserConnectionState => {
  const [loading, setLoading] = useState(false)
  const removeUserConnection: RemoveUserConnection = useCallback(async (
    primaryUserAccountId: string,
    provider: string,
    secondaryLinkedAccountId: string
  ): Promise<void> => {
    try {
      setLoading(true)
      const response = await fetchApi(
        'DELETE',
        '/auth0/user_management_api_v2/users/remove_connection',
        { primaryUserAccountId, provider, secondaryLinkedAccountId },
      )
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait for apply changes on Auth0
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
