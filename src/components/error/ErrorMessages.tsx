import styles from './ErrorMessages.module.css'
import { FC } from 'react'
import { ErrorMessage, RemoveErrorMessage } from '@/hooks/useErrorMessages'

interface ErrorMessagesProps {
  errorMessages: ErrorMessage[]
  removeErrorMessage: RemoveErrorMessage
}

export const ErrorMessages: FC<ErrorMessagesProps> = (props) => {
  const { errorMessages, removeErrorMessage } = props

  if (errorMessages.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      {errorMessages.map(({ id, message }) => {
        const ellipsisMessage = message.length > 100 ? `${message.slice(0, 100)}...` : message
        return (
          <div className={styles.messageContainer} key={id}>
            <span>{ellipsisMessage}</span>
            <button className={styles.messageClose} onClick={() => removeErrorMessage(id)}>Remove</button>
          </div>
        )
      })}
    </div>
  )
}
