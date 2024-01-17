// pages/api/auth/[...auth0].js
import { initAuth0 } from "@auth0/nextjs-auth0";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

let defaultAuth0: ReturnType<typeof initAuth0>;
let anotherAuth0: ReturnType<typeof initAuth0>;

function filterOptionalBool(value: unknown): boolean | undefined {
  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return undefined;
  }
};

function getAuth(req: NextApiRequest, res: NextApiResponse): ReturnType<typeof initAuth0> {
  const queryValue = filterOptionalBool(req.query.switchAnotherApplication);
  const cookieValue = filterOptionalBool(req.cookies["switchAnotherApplication"]);

  if (queryValue === false) {
    res.setHeader("Set-Cookie", serialize("switchAnotherApplication", "", { httpOnly: true }));
  }

  if (queryValue === true || (queryValue !== false && cookieValue === true)) {
    if (queryValue === true) {
      res.setHeader("Set-Cookie", serialize("switchAnotherApplication", "true", { httpOnly: true }));
    }
    return anotherAuth0 || (
      anotherAuth0 = initAuth0({
        clientID: process.env.AUTH0_CLIENT_ID_ANOTHER_APPLICATION,
        clientSecret: process.env.AUTH0_CLIENT_SECRET_ANOTHER_APPLICATION,
      })
    );
  }

  return defaultAuth0 || (defaultAuth0 = initAuth0({}));
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

  const auth0 = getAuth(req, res);
  await auth0.handleLogin(req, res, {
    authorizationParams: {
      invitation,
      organization,
      connection,
    },
  });
};

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  const auth0 = getAuth(req, res);
  return auth0.handleAuth({ login })(req, res);
}
