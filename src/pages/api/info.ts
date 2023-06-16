// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getSession, getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {Session} from "@auth0/nextjs-auth0/src/session";

type Data = {
  session: Session | null
  accessToken: string
}

export default withApiAuthRequired(async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: unknown }>
) => {
  try {
    await sleep(req.query.apiExecuteBeforeDelay)

    const session = (await getSession(req, res)) ?? null
    const accessToken = (await getAccessToken(req, res, {})).accessToken ?? "(None)"

    await sleep(req.query.apiExecuteAfterDelay)
    res.status(200).json({session, accessToken})
  } catch (err) {
    res.status(500).json({error: err})
  }
})

const sleep = async (val: unknown): Promise<void> => {
  const sec = parseInt(String(val), 10)
  if (isNaN(sec) || sec < 1 || 60 < sec) return
  await new Promise((resolve) => setTimeout(resolve, sec * 1000))
}
