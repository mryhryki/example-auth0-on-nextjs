import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0/client'
import { getConnectionByOrganizationMetadata } from '@/utils/auth0/getConnectionByOrganizationMetadata'
import { ApiResponse } from '@/pages/api/auth0/common'

const MAX_CONNECTIONS = 2
const OrgIdPrefix = 'org_'

interface ApiResponseData {
  connectionId: string,
  connectionName: string
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiResponseData>>,
) => {
  try {
    const session = await getSession(req, res)
    const { user } = session ?? {}
    const orgId = user?.org_id

    if (typeof orgId !== 'string' || !orgId.trim().startsWith(OrgIdPrefix)) {
      return res.status(500).json({ success: false, error: 'org_id is invalid' })
    }

    const { data: organization } = await auth0ManagementClient.organizations.get({ id: orgId })
    const connections = getConnectionByOrganizationMetadata(organization.metadata)
    if (connections.length >= MAX_CONNECTIONS) {
      return res.status(403).json({ success: false, error: `Max connection(${MAX_CONNECTIONS}) reached` })
    }

    const { name, displayName, signInUrl, x509SigningCert } = req.body
    const { data: { id: connectionId, name: connectionName } } = await auth0ManagementClient.connections.create({
      strategy: 'samlp',
      name: `${orgId.substring(OrgIdPrefix.length)}-${name}`,
      display_name: displayName,
      options: {
        signInEndpoint: signInUrl,
        signingCert: x509SigningCert,
      }
    })

    await auth0ManagementClient.organizations.update({ id: orgId }, {
      metadata: {
        ...(organization.metadata ?? {}),
        [connectionId]: JSON.stringify({ name: connectionName, enabled: true, displayName }),
      },
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
