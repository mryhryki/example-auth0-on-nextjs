import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0/client'
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
  invitation: Auth0OrganizationInvitation
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiResponseData>>,
) => {
  try {
    const organizationId = await getOrganizationId(req, res)
    const session = await getSession(req, res)
    const inviterEmail = session?.user?.email ?? '(Unknown User)'

    const clientId = process.env.AUTH0_CLIENT_ID ?? 'Unknown Client ID';
    const { connectionId, email } = req.body

    console.debug('#####', JSON.stringify({ email, connectionId }, null, 2));
    const { data } = await auth0ManagementClient.organizations.createInvitation({
      id: organizationId,
    },{
      inviter: {
        name: inviterEmail
      },
      invitee: {
        email,
      },
      client_id: clientId,
      connection_id: connectionId,
    })


    res.status(200).json({ success: true, payload: { invitation: data } })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ success: false, error: err })
  }
})
