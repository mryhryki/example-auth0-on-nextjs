import { auth0ManagementClient } from '@/utils/auth0/client'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'


export interface Auth0OrganizationMember {
  user_id?: string | undefined;
  picture?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
}

interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  username: string;
  phone_number: string;
  phone_verified: boolean;
  created_at: string | { [key: string]: unknown; };
  updated_at: string | { [key: string]: unknown; };
  identities: {
    connection: string;
    user_id: string;
    provider: string;
    isSocial: boolean;
    access_token: string;
    access_token_secret: string;
    refresh_token: string;
    profileData: {
      email?: string;
      email_verified?: boolean;
      name?: string;
      username?: string;
      given_name?: string;
      phone_number?: string;
      phone_verified?: boolean;
      family_name?: string;
    }
  }[];
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  picture: string;
  name: string;
  nickname: string;
  multifactor: Array<string>;
  last_ip: string;
  last_login: string | { [key: string]: unknown; };
  logins_count: number;
  blocked: boolean;
  given_name: string;
  family_name: string;
}

export interface Auth0OrganizationMemberWithRawUserData extends Auth0OrganizationMember {
  rawUserData: Auth0User | null
}

interface ApiResponseData {
  members: Auth0OrganizationMemberWithRawUserData[]
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const session = (await getSession(req, res)) ?? null
    const { data } = await auth0ManagementClient.organizations.getMembers({
      id: session?.user.org_id,
      page: 0,
      per_page: 100,
    })

    const userIds = data.map((member) => member.user_id)
    const { data: users } = await auth0ManagementClient.users.getAll({
      page: 0,
      per_page: 100,
      q: `(${userIds.map((id) => `user_id:"${id}"`).join(' OR ')})`,
    })
    const usersById = new Map(users.map((user) => [user.user_id, user]))

    const members = data.map((member): Auth0OrganizationMemberWithRawUserData => ({
      ...member,
      rawUserData: usersById.get(member.user_id) ?? null,
    }))
    res.status(200).json({ members })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
