import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0/client'
import { ApiResponse } from '@/pages/api/auth0/common'
import { Auth0User } from '@/pages/api/auth0/user_management_api_v2/users/create_user'

interface ApiResponseData {
  user: Auth0User
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiResponseData>>,
) => {
  try {
    const { userId, metadata } = req.body
    const { data } = await auth0ManagementClient.users.update({
      id: userId,
    }, {
      app_metadata: {
        ...metadata,
      },
    })

    res.status(200).json({ success: true, payload: { user: data } })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ success: false, error: err })
  }
})
