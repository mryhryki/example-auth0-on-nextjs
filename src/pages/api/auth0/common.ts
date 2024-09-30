import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export type ApiSuccessResponse<T> = {
  success: true
  payload: T
}

export type ApiErrorResponse = {
  success: false
  error: unknown
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export const getOrganizationId = async (req: NextApiRequest, res: NextApiResponse): Promise<string> => {
  const session = await getSession(req, res)
  const { user } = session ?? {}
  const orgId = user?.org_id
  if (typeof orgId !== 'string' || !orgId.startsWith('org_')) {
    throw new Error('org_id is invalid')
  }
  return orgId;
}
