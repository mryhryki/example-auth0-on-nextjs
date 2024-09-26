import { auth0ManagementClient } from '@/utils/auth0/client'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Auth0Organization } from '@/pages/api/auth0/user_management_api_v2/organizations/get_organization'

interface ApiResponseData {
  organization: Auth0Organization
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const session = (await getSession(req, res)) ?? null
    const { metadata } = req.body
    const { data } = await auth0ManagementClient.organizations.update({ id: session?.user.org_id }, { metadata })
    res.status(200).json({ organization: data })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
