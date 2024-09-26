import { auth0ManagementClient } from '@/utils/auth0/client'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

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
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const session = (await getSession(req, res)) ?? null
    const { data } = await auth0ManagementClient.organizations.getInvitations({
      id: session?.user.org_id,
      page: 0,
      per_page: 100,
    })
    res.status(200).json({ invitations: data})
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
