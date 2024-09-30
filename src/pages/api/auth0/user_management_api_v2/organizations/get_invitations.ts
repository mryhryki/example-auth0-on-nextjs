import { auth0ManagementClient } from '@/utils/auth0/client'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, getOrganizationId } from '@/pages/api/auth0/common'

export interface Auth0OrganizationInvitation {
  id: string;
  organization_id: string;
  inviter: {
    name: string;
  };
  invitee: {
    email: string;
  };
  invitation_url: string;
  created_at: string;
  expires_at: string;
  connection_id?: string | undefined;
  client_id: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  ticket_id: string;
  roles?: string[] | undefined;
}

interface ApiResponseData {
  invitations: Auth0OrganizationInvitation[]
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiResponseData>>,
) => {
  try {
    const organizationId = await getOrganizationId(req, res)
    const { data } = await auth0ManagementClient.organizations.getInvitations({
      id: organizationId,
      page: 0,
      per_page: 100,
    })
    res.status(200).json({ success: true, payload: { invitations: data}})
  } catch (err) {
    res.status(500).json({ success: false, error: err })
  }
})
