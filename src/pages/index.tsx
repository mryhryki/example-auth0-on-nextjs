import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function Index() {
  return (
    <div>
      Redirect to &quot;/access_info&quot;
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function getServerSideProps() {
    return {
      redirect: {
        permanent: false,
        destination: "/access_info",
      }
    }
  },
});

