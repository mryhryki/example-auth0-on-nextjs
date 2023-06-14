// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {GetServerSidePropsContext} from "next";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const serverSideProps = await withPageAuthRequired()(ctx);

  // [Session]
  const session = await getSession(ctx.req, ctx.res).catch(() => null);
  process.stdout.write(`### Session ###\n${JSON.stringify(session, null, 2)}\n`)
}
