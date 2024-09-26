import { auth0ManagementClient } from '@/utils/auth0/client'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  Auth0OrganizationConnection,
} from '@/pages/api/auth0/user_management_api_v2/organizations/get_enabled_connections'

interface ApiResponseData {
  connection: Auth0OrganizationConnection
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const connectionId = req.query.connectionId
    if (typeof connectionId !== 'string') {
      res.status(400).json({ error: '"connectionId" is empty' })
      return
    }

    const session = (await getSession(req, res)) ?? null
    const { data } = await auth0ManagementClient.organizations.getEnabledConnection({
      id: session?.user.org_id,
      connectionId,
    })
    res.status(200).json({ connection: data })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
