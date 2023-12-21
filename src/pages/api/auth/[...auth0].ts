// pages/api/auth/[...auth0].js
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

// Ref: https://github.com/auth0/nextjs-auth0/issues/701#issuecomment-1255350171
// @ts-ignore
const login = async (req, res) => {
  const invitation: string | undefined = req.query.invitation;
  const organization: string | undefined = req.query.organization;
  const connection = organization != null ? undefined : "Username-Password-Authentication";

  await handleLogin(req, res, {
    authorizationParams: {
      invitation,
      organization,
      connection,
    },
  });
};

export default handleAuth({ login });
