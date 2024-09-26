import { auth0ManagementClient } from '@/utils/auth0/client'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Auth0Organization {
  id: string;
  name: string;
  display_name: string;
  branding: {
    logo_url: string;
    colors: {
      primary: string;
      page_background: string;
    }
  };
  metadata: {
    [key: string]: string | null | undefined;
  };
}

interface ApiResponseData {
  organization: Auth0Organization
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const session = (await getSession(req, res)) ?? null
    const { data } = await auth0ManagementClient.organizations.get({ id: session?.user.org_id })
    res.status(200).json({ organization: data })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
