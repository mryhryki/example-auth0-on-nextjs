import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0/client'
import { getConnectionByOrganizationMetadata } from '@/utils/auth0/getConnectionByOrganizationMetadata'

const MAX_CONNECTIONS = 2
const OrgIdPrefix = 'org_'

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<unknown | { error: unknown }>,
) => {
  try {
    const session = await getSession(req, res)
    const { user } = session ?? {}
    const orgId = user?.org_id

    if (typeof orgId !== 'string' || !orgId.trim().startsWith(OrgIdPrefix)) {
      throw new Error('org_id is invalid')
    }

    const { data: organization } = await auth0ManagementClient.organizations.get({ id: orgId })
    const connections = getConnectionByOrganizationMetadata(organization.metadata)
    if (connections.length >= MAX_CONNECTIONS) {
      res.status(403).json({ success: false, error: 'Max connection reached' })
      return
    }

    const { name, signInUrl, x509SigningCert } = req.body

    const { data: { id: connectionId, name: connectionName } } = await auth0ManagementClient.connections.create({
      strategy: 'samlp',
      name: `${orgId.substring(OrgIdPrefix.length)}-${name}`,
      options: {
        signInEndpoint: signInUrl,
        signingCert: x509SigningCert,
      }
    })

    await auth0ManagementClient.organizations.addEnabledConnection({ id: orgId }, {
      connection_id: connectionId,
      assign_membership_on_login: false,
    })

    res.status(200).json({ success: true, payload: { connectionId, connectionName } })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ success: false, error: err })
  }
})
