import styles from './Messages.module.css'
import { FC } from 'react'
import { MessageInfo, RemoveMessage } from '@/hooks/useMessages'

interface ErrorMessagesProps {
  errorMessages: MessageInfo[]
  removeMessage: RemoveMessage
}

export const Messages: FC<ErrorMessagesProps> = (props) => {
  const { errorMessages, removeMessage } = props

  if (errorMessages.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      {errorMessages.map(({ id, type, message }) => {
        const colorStyle = type === 'info' ? styles.infoContainer : styles.errorContainer
        return (
          <div className={`${styles.messageContainer} ${colorStyle}`} key={id}>
            <span className={styles.message}>{message}</span>
            <button className={styles.messageClose} onClick={() => removeMessage(id)}>Remove</button>
          </div>
        )
      })}
    </div>
  )
}
