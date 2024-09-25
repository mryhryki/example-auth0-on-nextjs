import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0'

const OrgIdPrefix = 'org_'

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<unknown | { error: unknown }>,
) => {
  try {
    const session = await getSession(req, res)
    const { user } = session ?? {}
    const inviterEmail = user.email ?? '(Unknown User)'
    const orgId = user?.org_id

    if (typeof orgId !== 'string' || !orgId.trim().startsWith(OrgIdPrefix)) {
      throw new Error('org_id is invalid')
    }

    const clientId = process.env.AUTH0_CLIENT_ID ?? 'Unknown Client ID';
    const { connectionId, email } = req.body

    const { data } = await auth0ManagementClient.organizations.createInvitation({
      id: orgId,
    },{
      inviter: {
        name: inviterEmail
      },
      invitee: {
        email,
      },
      client_id: clientId,
      connectionId: connectionId,
    })


    res.status(200).json({ success: true, payload: { connectionId, connectionName } })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ success: false, error: err })
  }
})
