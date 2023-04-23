import {withPageAuthRequired} from '@auth0/nextjs-auth0';
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
  const user: UserProfile = (serverSideProps as any /* FIXME */).props.user
  const client = new ManagementClient({
    token: process.env.AUTH0_MANAGEMENT_API_TOKEN ?? "",
    domain: new URL(process.env.AUTH0_ISSUER_BASE_URL ?? "").hostname,
  })
  process.stdout.write(`### Server Side Log 1 ###\n${JSON.stringify(user, null, 2)}\n`)
  // @ts-ignore
  const auth0User = await client.getUser({id: user.sub ?? "", fields: ["app_metadata"]})
  process.stdout.write(`### Server Side Log 2 ###\n${JSON.stringify(auth0User, null, 2)}\n`)
  return serverSideProps
}
