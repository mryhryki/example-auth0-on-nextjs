import { handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from 'next'

export const auth0LoginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ref: https://github.com/auth0/nextjs-auth0/issues/701#issuecomment-1255350171
  const invitation = filterString(req.query.invitation);
  const organization = filterString(req.query.organization);
  const connection = organization != null ? filterString(req.query.connection) : "Username-Password-Authentication";

  await handleLogin(req, res, {
    authorizationParams: {
      invitation,
      organization,
      connection,
    },
  });
};

function filterString(val: unknown): string | undefined {
  return typeof val === "string" && val.trim().length > 0 ? val : undefined;
}
