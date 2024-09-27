import { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/utils/auth0/api'
import { Auth0OrganizationInvitation } from '@/pages/api/auth0/user_management_api_v2/organizations/get_invitations'
import { AppMessage } from '@/components/message/AppMessage'

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
      setInvitations(data.invitations)
    }).catch((err) => {
      AppMessage.addErrorMessage(`Failed to load invitations: ${err}`)
    }).finally(() => {
      loading.current = false
    })
  }, [])

  return {
    invitations,
    loading: loading.current,
  }
}
