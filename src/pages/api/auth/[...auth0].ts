// pages/api/auth/[...auth0].js
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

// Ref: https://github.com/auth0/nextjs-auth0/issues/701#issuecomment-1255350171
// @ts-ignore
const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const invitation = filterString(req.query.invitation);
  const organization = filterString(req.query.organization);
  const connection = organization != null ? undefined : "Username-Password-Authentication";

  await handleLogin(req, res, {
    authorizationParams: {
      invitation,
      organization,
      connection,
    },
  });
};

function filterString(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

export default handleAuth({ login });
