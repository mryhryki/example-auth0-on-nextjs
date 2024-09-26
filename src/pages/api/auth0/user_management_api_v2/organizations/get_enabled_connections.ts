import { auth0ManagementClient } from '@/utils/auth0/client'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Auth0OrganizationConnection {
  connection_id: string;
  assign_membership_on_login: boolean;
  connection: {
    name: string;
    strategy: string;
  };
}

interface ApiResponseData {
  connections: Auth0OrganizationConnection[]
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const session = (await getSession(req, res)) ?? null
    const { data } = await auth0ManagementClient.organizations.getEnabledConnections({
      id: session?.user.org_id,
      page: 0,
      per_page: 100,
    })
    res.status(200).json({ connections: data })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
