// pages/api/auth/[...auth0].js
import { initAuth0 } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

function getAuth(req: NextApiRequest): ReturnType<typeof initAuth0> {
  const switchAnotherApplication: boolean = req.query.switchAnotherApplication === "true";
  if (switchAnotherApplication) {
    return initAuth0({
      clientID: process.env.AUTH0_CLIENT_ID_ANOTHER_APPLICATION,
      clientSecret: process.env.AUTH0_CLIENT_SECRET_ANOTHER_APPLICATION,
    });
  } else {
    return initAuth0({});
  }
}

function filterString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }
  return undefined;
}

// Ref: https://github.com/auth0/nextjs-auth0/issues/701#issuecomment-1255350171
async function login(req: NextApiRequest, res: NextApiResponse) {
  const invitation = filterString(req.query.invitation);
  const organization = filterString(req.query.organization);
  const connection = organization != null ? undefined : "Username-Password-Authentication";

  const auth0 = getAuth(req);
  await auth0.handleLogin(req, res, {
    authorizationParams: {
      invitation,
      organization,
      connection,
    },
  });
};

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  const auth0 = getAuth(req);
  return auth0.handleAuth({ login })(req, res);
}
