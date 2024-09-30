import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { auth0ManagementClient } from '@/utils/auth0/client'

export interface Auth0User {
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

interface ApiResponseData {
  user: Auth0User
}

const HexChars = '0123456789abcdef'
const generateRandomPassword = (): string => {
  const arr = new Uint8Array(128)
  crypto.getRandomValues(arr)
  return Array.from(arr).map((i) => {
    const first = HexChars[i >> 4]
    const second = HexChars[i & 0x0f]
    return `${first}${second}`
  }).join('')
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData | { error: unknown }>,
) => {
  try {
    const { connectionId, email } = req.body
    const { data } = await auth0ManagementClient.users.create({
      email,
      connection: connectionId,
      password: generateRandomPassword(),
    })

    res.status(200).json({ success: true, payload: { data } })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ success: false, error: err })
  }
})
