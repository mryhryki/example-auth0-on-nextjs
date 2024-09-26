import styles from './Messages.module.css'
import { FC, useEffect, useState } from 'react'
import { AppMessage, Message } from '@/components/message/AppMessage'


export const Messages: FC = () => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    AppMessage.setOnChange(setMessages)
    return () => {
      AppMessage.setOnChange(() => console.warn('Dummy onChange handler'))
    }
  }, [setMessages])

  if (messages.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      {messages.map(({ id, type, message }) => {
        const colorStyle = type === 'info' ? styles.infoContainer : styles.errorContainer
        return (
          <div className={`${styles.messageContainer} ${colorStyle}`} key={id}>
            <span className={styles.message}>{message}</span>
            <button className={styles.messageClose} onClick={() => AppMessage.removeMessage(id)}>Remove</button>
          </div>
        )
      })}
    </div>
  )
}
