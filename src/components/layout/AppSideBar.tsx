import { FC } from 'react'
import styles from '@/pages/_app.module.css'
import Link from 'next/link'
import { useCurrentUrl } from '@/hooks/useCurrentUrl'

const Paths: string[] = [
  '/access_info',
  '/organization',
  '/organization_members',
]

export const AppSideBar: FC = () => {
  const currentUrl = useCurrentUrl()
  const currentPath: string = currentUrl?.pathname?.split('/')?.slice(0, 2)?.join("/") ?? ''

  return (
    <div className={styles.sideBar}>
      {Paths.map((path: string) => (
        <Link key={path} href={path} className={path === currentPath ? styles.sideBarLinkActive : ''}>
          {path.substring(1).split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Link>
      ))}
      <Link href="/api/auth/logout">Logout</Link>
    </div>
  )
}
