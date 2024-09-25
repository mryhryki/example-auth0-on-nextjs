import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0'

export const POST = withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<unknown | { error: unknown }>,
) => {
  try {
    console.debug('#####', JSON.stringify({ body: req.body }, null, 2))

    const response = await auth0ManagementClient.connections.create({
      name: 'sso_name',
      display_name: 'sso_display_name',
      strategy: 'samlp',
    })
    if (response.status === 200) {
      res.status(200).json({ success: true })
      return
    }
    res.status(response.status).json({ error: response })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
