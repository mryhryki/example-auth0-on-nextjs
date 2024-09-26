import { NextApiRequest, NextApiResponse } from 'next'
import { getAccessToken, getSession } from '@auth0/nextjs-auth0'
import { IncomingMessage, ServerResponse } from 'node:http'
import { NextRequest, NextResponse } from 'next/server'

export interface Auth0User {
  email: string
  email_verified: boolean
  sid: string
  sub: string
}

export interface Auth0OrganizationInfo {
  orgId: string
  orgIdWithoutPrefix: string
  orgName: string
  displayName: string
  enableSSO: boolean
}

export interface Auth0AccessToken {
  accessToken: string
  accessTokenHash: string
  accessTokenScope: string
  accessTokenExpiresAt: number
}

export interface Auth0Session {
  user: Auth0User
  organization: Auth0OrganizationInfo
  accessToken: Auth0AccessToken
}

const OrgIdPrefix = 'org_'

export const getAuth0Session = async (...args: [IncomingMessage, ServerResponse] | [NextApiRequest, NextApiResponse] | [NextRequest, NextResponse]): Promise<Auth0Session> => {
  const session = await getSession(...args)
  if (session == null) {
    throw new Error('No session')
  }

  const { user } = session


  const orgId = user?.org_id ?? '(No org_id)'
  const orgName = user?.org_name ?? '(No org_name)'
  if (typeof orgId !== 'string' || !orgId.trim().startsWith(OrgIdPrefix)) {
    throw new Error('org_id is invalid')
  }
  const orgIdWithoutPrefix = orgId.substring(OrgIdPrefix.length)
  // Get by custom claim
  const displayName = user?.orgDisplayName ?? '(No orgDisplayName)'
  const enableSSO = user?.orgEnableSSO ?? false

  const accessToken: string = (await getAccessToken(...args, { refresh: false })).accessToken ?? ''
  const accessTokenHash = Buffer.from(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(accessToken)),
  ).toString('hex')
  const { accessTokenScope, accessTokenExpiresAt } = session

  return {
    user: {
      email: user?.email ?? '(No email)',
      email_verified: user?.email_verified ?? false,
      sid: user?.sid ?? '(No sid)',
      sub: user?.sub ?? '(No sub)',
    },
    organization: {
      orgId,
      orgIdWithoutPrefix,
      orgName,
      displayName,
      enableSSO,
    },
    accessToken: {
      accessToken,
      accessTokenHash,
      accessTokenScope: accessTokenScope ?? '(No scope)',
      accessTokenExpiresAt: accessTokenExpiresAt ?? 0,
    },
  }
}
