import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Messages } from '@/components/message/Messages'
import { useMessages } from '@/hooks/useMessages'
import { useCreateNewInvitation } from '@/hooks/useCreateNewInvitation'

export default function SsoPage() {
  const { errorMessages, removeMessage, addMessage } = useMessages()
  const { values, setValues, canSubmit, onSubmit } = useCreateNewInvitation({ addMessage })

  return (
    <section>
      <h1>Create an Invitation</h1>
      <form onSubmit={onSubmit}>
        <label>
          <div>Email</div>
          <input
            type="text"
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>
        <input type="submit" value="Create" disabled={!canSubmit} />
      </form>
      <Messages errorMessages={errorMessages} removeMessage={removeMessage} />
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({})

