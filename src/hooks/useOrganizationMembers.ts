import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/auth0/api'
import {
  Auth0OrganizationMemberWithRawUserData,
} from '@/pages/api/auth0/user_management_api_v2/organizations/get_members'
import { AppMessage } from '@/components/message/AppMessage'

interface UseOrganizationMembersState {
  members: Auth0OrganizationMemberWithRawUserData[]
  reload: () => Promise<void>
  loading: boolean;
}

export const useOrganizationMembers = (): UseOrganizationMembersState => {
  const loading = useRef(true)
  const [members, setMembers] = useState<Auth0OrganizationMemberWithRawUserData[]>([])

  const reload = useCallback(async (): Promise<void> => {
    loading.current = true
    fetchApi<{ members: Auth0OrganizationMemberWithRawUserData[] }>(
      'GET',
      '/auth0/user_management_api_v2/organizations/get_members',
    ).then((data) => {
      setMembers(data.members)
    }).catch((err) => {
      AppMessage.addErrorMessage(`Failed to load members: ${err}`)
    }).finally(() => {
      loading.current = false
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return {
    members,
    reload,
    loading: loading.current,
  }
}
