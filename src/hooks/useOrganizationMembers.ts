import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { Auth0OrganizationMember } from '@/pages/api/auth0/user_management_api_v2/organizations/get_members'
import { AppMessage } from '@/components/message/AppMessage'

interface UseOrganizationMembersState {
  members: Auth0OrganizationMember[]
  loading: boolean;
}

export const useOrganizationMembers = (): UseOrganizationMembersState => {
  const loading = useRef(true)
  const [members, setMembers] = useState<Auth0OrganizationMember[]>([])

  useEffect(() => {
    fetchApi<{ members: Auth0OrganizationMember[] }>(
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

  return {
    members,
    loading: loading.current,
  }
}
