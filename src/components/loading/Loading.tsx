import { FC } from 'react'
import { useLoadingEmoji } from '@/hooks/useLoadingEmoji'
import styles from "./Loading.module.css"

export const Loading: FC = () => {
  const loadingEmoji =  useLoadingEmoji()
  return <div className={styles.loading}>Loading...{loadingEmoji}</div>
}
