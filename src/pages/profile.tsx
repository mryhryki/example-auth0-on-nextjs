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
  // const user: UserProfile = (serverSideProps as any /* FIXME */).props.user
  // process.stdout.write(`### User Profile ###\n${JSON.stringify(user, null, 2)}\n`)
  // const {hostname} = new URL(process.env.AUTH0_ISSUER_BASE_URL ?? "")

  // [User Info]
  // const client = new ManagementClient({
  //   token: process.env.AUTH0_MANAGEMENT_API_TOKEN ?? "",
  //   domain: hostname,
  // })
  // // @ts-ignore
  // const auth0User = await client.getUser({id: user.sub ?? ""})
  // const userRoles = await client.getUserRoles({id: user.sub ?? ""})
  // const userPermissions = await client.getUserPermissions({id: user.sub ?? ""})
  // process.stdout.write(`### Server Side Log 4 ###\n${JSON.stringify({ auth0User, userRoles, userPermissions}, null, 2)}\n`)

  return serverSideProps
}
