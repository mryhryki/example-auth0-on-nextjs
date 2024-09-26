import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { Auth0OrganizationMember } from '@/pages/api/auth0/user_management_api_v2/organizations/get_members'

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
      loading.current = false
      setMembers(data.members)
    })
  }, [])

  return {
    members,
    loading: loading.current,
  }
}
