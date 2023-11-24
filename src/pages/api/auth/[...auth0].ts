// pages/api/auth/[...auth0].js
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

// Ref: https://github.com/auth0/nextjs-auth0/issues/701#issuecomment-1255350171
// @ts-ignore
const login = async (req, res) => {
  await handleLogin(req, res, {
    authorizationParams: {
      invitation: req.query.invitation,
      organization: req.query.organization,
    },
  });
};

export default handleAuth({ login });
