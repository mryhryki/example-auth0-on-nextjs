import { auth0ManagementClient } from '@/utils/auth0/client'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Auth0User } from '@/pages/api/auth0/user_management_api_v2/user/create_user'
import { ApiResponse, getOrganizationId } from '@/pages/api/auth0/common'


export interface Auth0OrganizationMember {
  user_id?: string | undefined;
  picture?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
}

export interface Auth0OrganizationMemberWithRawUserData extends Auth0OrganizationMember {
  rawUserData: Auth0User | null
}

interface ApiResponseData {
  members: Auth0OrganizationMemberWithRawUserData[]
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiResponseData>>,
) => {
  try {
    const organizationId = await getOrganizationId(req, res)

    const { data } = await auth0ManagementClient.organizations.getMembers({
      id: organizationId,
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
    res.status(200).json({ success: true, payload: { members } })
  } catch (err) {
    res.status(500).json({ success: false, error: err })
  }
})
