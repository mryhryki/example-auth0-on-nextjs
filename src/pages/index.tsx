import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import {useUser} from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {useFetchTest} from "@/hooks/useFetchTest";
import {useElapsedSec} from "@/hooks/useElapsedSec";
import {useRef} from "react";

export default function Home() {
  const {user} = useUser()
  const {
    fetchTest,
    testResults,
    lastRequestUnixTime,
    settings,
    addSetting,
    editSetting,
    removeSetting
  } = useFetchTest()
  const elapsedSec = useElapsedSec(lastRequestUnixTime)

  return (
    <>
      <Head>
        <title>Auth0 Next.js Example</title>
        <meta name="description" content="Generated by create next app"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.userName}>{user?.email ?? '(Not logged in)'}</span>
          {user != null ? (
            <Link href="/api/auth/logout">Logout</Link>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </header>

        <div className={styles.content}>
          <ol>
            {settings.map((setting) => (
              <li key={setting.id} className={styles.settingElement}>
                <code>ID:{setting.id}</code>
                <div>
                  <label>
                    <span>RequestDelay:</span>
                    <input
                      type="number"
                      className={styles.numberInput}
                      value={setting.requestDelay}
                      onChange={(event) => editSetting(setting.id, {requestDelay: parseInt(event.target.value, 10)})}
                    />
                    <span>sec</span>
                  </label>
                </div>
                <div>
                  <label>
                    <span>ApiExecuteBeforeDelay:</span>
                    <input
                      type="number"
                      className={styles.numberInput}
                      value={setting.apiExecuteBeforeDelay}
                      onChange={(event) => editSetting(setting.id, {apiExecuteBeforeDelay: parseInt(event.target.value, 10)})}
                    />
                    <span>sec</span>
                  </label>
                </div>
                <div>
                  <label>
                    <span>ApiExecuteAfterDelay:</span>
                    <input
                      type="number"
                      className={styles.numberInput}
                      value={setting.apiExecuteAfterDelay}
                      onChange={(event) => editSetting(setting.id, {apiExecuteAfterDelay: parseInt(event.target.value, 10)})}
                    />
                    <span>sec</span>
                  </label>
                </div>
                <div className={styles.settingButtons}>
                  <button onClick={() => removeSetting(setting.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.actionButtons}>
            <button onClick={addSetting}>Add Setting</button>
            <button onClick={fetchTest} disabled={settings.length < 1}>Fetch Test</button>
            <span>(Elapsed: {Math.floor(elapsedSec / 60)}:{(elapsedSec % 60).toString(10).padStart(2, '0')})</span>
          </div>
          <pre
            onChange={() => undefined}
            className={styles.testResult}
          >
          {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()
