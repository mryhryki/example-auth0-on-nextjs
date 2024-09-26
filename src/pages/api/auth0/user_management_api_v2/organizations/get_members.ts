import { auth0ManagementClient } from '@/utils/auth0/client'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Auth0OrganizationMember {
  user_id?: string | undefined;
  picture?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
}

interface ApiResponseData {
  members: Auth0OrganizationMember[]
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const session = (await getSession(req, res)) ?? null
    const { data } = await auth0ManagementClient.organizations.getMembers({
      id: session?.user.org_id,
      page: 0,
      per_page: 100,
    })
    res.status(200).json({ members: data })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
