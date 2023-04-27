import {withPageAuthRequired, getAccessToken} from '@auth0/nextjs-auth0';
import {GetServerSidePropsContext} from "next";
import {UserProfile} from "@auth0/nextjs-auth0/client";
import {ManagementClient} from "auth0"


export default function Profile({user}: any /* FIXME */) {
  return <div>Hello, {user.name}</div>;
}

// You can optionally pass your own `getServerSideProps` function into
// `withPageAuthRequired` and the props will be merged with the `user` prop
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const serverSideProps = await withPageAuthRequired()(ctx);

  // [Access Token]
  const accessTokenResult = await getAccessToken(ctx.req, ctx.res)
  process.stdout.write(`### Access Token ###\n${JSON.stringify(accessTokenResult, null, 2)}\n`)

  // [User Profile]
  const user: UserProfile = (serverSideProps as any /* FIXME */).props.user
  // process.stdout.write(`### User Profile ###\n${JSON.stringify(user, null, 2)}\n`)

  // [User Info]
  const {hostname} = new URL(process.env.AUTH0_ISSUER_BASE_URL ?? "")
  const client = new ManagementClient({
    token: process.env.AUTH0_MANAGEMENT_API_TOKEN ?? "",
    domain: hostname,
  })

  const userId = user.sub ?? 'unknown'
  await client.updateUser({id: userId}, {app_metadata: {Role: "Admin", updatedBy: '{UserID}'}})
  const auth0User = await client.getUser({id: userId})
  process.stdout.write(`### Server Side Log 4 ###\n${JSON.stringify({auth0User}, null, 2)}\n`)

  // [Role and Permissions]
  // const userRoles = await client.getUserRoles({id: user.sub ?? ""})
  // const userPermissions = await client.getUserPermissions({id: user.sub ?? ""})
  // process.stdout.write(`### Role and Permissions ###\n${JSON.stringify({ userRoles, userPermissions}, null, 2)}\n`)

  return serverSideProps
}
