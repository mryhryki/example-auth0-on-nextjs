import { useCallback, useState } from 'react'
import { fetchApi } from '@/utils/auth0/api'
import { AppMessage } from '@/components/message/AppMessage'
import { Auth0User } from '@/pages/api/auth0/user_management_api_v2/users/create_user'

interface UseUpdateUserMetadataState {
  updateUserMetadata: (userId: string, metadata: Record<string, unknown>) => Promise<void>
  updating: boolean;
}

export const useUpdateUserMetadata = (): UseUpdateUserMetadataState => {
  const [updating, setUpdating] = useState(false)

  const updateUserMetadata = useCallback(async (
    userId: string,
    metadata: Record<string, unknown>,
  ): Promise<void> => {
    try {
      setUpdating(true)
      const data = await fetchApi<{ user: Auth0User }>(
        'PUT',
        '/auth0/user_management_api_v2/users/update_user_metadata',
        { userId, metadata },
      )
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait for apply changes on Auth0
      AppMessage.addInfoMessage(`Member metadata updated: ${JSON.stringify(data)}`)
    } catch (err) {
      AppMessage.addErrorMessage(`Failed to update member metadata: ${err}`)
    } finally {
      setUpdating(false)
    }
  }, [setUpdating])

  return {
    updating,
    updateUserMetadata,
  }
}
