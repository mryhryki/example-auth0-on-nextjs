import { auth0ManagementClient } from '@/utils/auth0/client'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, getOrganizationId } from '@/pages/api/auth0/common'

export interface Auth0OrganizationConnection {
  connection_id: string;
  assign_membership_on_login: boolean;
  connection: {
    name: string;
    strategy: string;
  };
  customData: {
    isDatabaseConnection: boolean
  }
}

interface ApiResponseData {
  connections: Auth0OrganizationConnection[]
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiResponseData>>,
) => {
  try {
    const organizationId = await getOrganizationId(req, res)
    const connections: Auth0OrganizationConnection[] = (await auth0ManagementClient.organizations.getEnabledConnections(
      {
      id: organizationId,
      page: 0,
      per_page: 100,
      })).data.map((connection): Auth0OrganizationConnection => ({
      ...connection,
      customData: {
        isDatabaseConnection: connection.connection.name === 'Username-Password-Authentication',
      },
    }))
    res.status(200).json({ success: true, payload: { connections } })
  } catch (err) {
    res.status(500).json({ success: false, error: err })
  }
})
