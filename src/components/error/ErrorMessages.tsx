import styles from './ErrorMessages.module.css'

export const ErrorMessages = (props: { messages: string[] }) => {
  const { messages } = props

  if (messages.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      {messages.map((message, i) => (
        <div className={styles.message} key={`${i}:${message}`}>
          ERROR: {message}
        </div>
      ))}
    </div>
  )
}
