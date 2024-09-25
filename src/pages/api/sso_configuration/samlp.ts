import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0'

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<unknown | { error: unknown }>,
) => {
  try {
    const { displayName, signInUrl, x509SigningCert } = req.body
    const date = new Date().toISOString().substring(0, 10).replace(/-/g, '')
    const uuid = crypto.randomUUID().replace(/-/g, '')
    const connectionName = `${date}-${uuid}`

    const { data: { id: connectionId } } = await auth0ManagementClient.connections.create({
      strategy: 'samlp',
      name: connectionName,
      display_name: displayName,
      options: {
        signInEndpoint: signInUrl,
        signingCert: x509SigningCert,
      },
      metadata: {},
    })

    // TODO Link organization

    res.status(200).json({ success: true, payload: { connectionId, connectionName } })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ success: false, error: err })
  }
})
