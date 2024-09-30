import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0/client'
import { ApiResponse } from '@/pages/api/auth0/common'


export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
) => {
  try {
    const { primaryUserAccountId, provider, secondaryLinkedAccountId } = req.body
    await auth0ManagementClient.users.unlink({
      id: primaryUserAccountId,
      provider,
      user_id: secondaryLinkedAccountId,
    })
    await auth0ManagementClient.users.delete({ id: `${provider}|${secondaryLinkedAccountId}` })
    res.status(200).json({ success: true, payload: {} })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ success: false, error: err })
  }
})
