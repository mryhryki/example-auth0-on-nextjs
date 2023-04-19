// https://auth0.com/docs/quickstart/webapp/nextjs#add-the-userprovider-component
import '@/styles/globals.css'
import {UserProvider} from '@auth0/nextjs-auth0/client';
import type {AppProps} from 'next/app'

const log = (message: string) => {
  const { stdout } = process
  stdout.write(message)
  stdout.end()
}

export default function App({Component, pageProps}: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
export const getServerSideProps = () => {
  log('AAAAAAAAAAAAAAAAAa')
  return {}
}
