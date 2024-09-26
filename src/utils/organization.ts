import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export interface Auth0OrganizationInfo {
  orgId: string
  orgIdWithoutPrefix: string
  orgName: string
  displayName: string
  enableSSO: boolean
}

const OrgIdPrefix = 'org_'

export const getOrganizationInfo = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<Auth0OrganizationInfo> => {
  const session = await getSession(req, res)
  // console.debug('Session:', JSON.stringify(session, null, 2))
  const { user } = session ?? {}

  const orgId = user?.org_id ?? '(No org_id)'
  const orgName = user?.org_name ?? '(No org_name)'

  if (typeof orgId !== 'string' || !orgId.trim().startsWith(OrgIdPrefix)) {
    throw new Error('org_id is invalid')
  }
  const orgIdWithoutPrefix = orgId.substring(OrgIdPrefix.length)

  // Get by custom claim
  const displayName = user?.orgDisplayName ?? '(No orgDisplayName)'
  const enableSSO = user?.orgEnableSSO ?? false

  return {
    orgId,
    orgIdWithoutPrefix,
    orgName,
    displayName,
    enableSSO,
  }

}
