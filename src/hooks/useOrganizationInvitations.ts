import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/api'
import { Auth0OrganizationInvitation } from '@/pages/api/auth0/user_management_api_v2/organizations/get_invitations'

interface UseOrganizationInvitationsState {
  invitations: Auth0OrganizationInvitation[]
  loading: boolean;
}

export const useOrganizationInvitations = (): UseOrganizationInvitationsState => {
  const loading = useRef(true)
  const [invitations, setInvitations] = useState<Auth0OrganizationInvitation[]>([])

  useEffect(() => {
    fetchApi<{ invitations: Auth0OrganizationInvitation[] }>(
      'GET',
      '/auth0/user_management_api_v2/organizations/get_invitations',
    ).then((data) => {
      loading.current = false
      setInvitations(data.invitations)
    })
  }, [])

  return {
    invitations,
    loading: loading.current,
  }
}
