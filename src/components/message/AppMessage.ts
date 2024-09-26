export type MessageType = 'info' | 'error'

export interface Message {
  id: string
  type: MessageType
  message: string
}

type OnChangeHandler = (messages: Message[]) => void

class AppMessageClass {
  private messages: Message[] = []
  private onChange: OnChangeHandler = () => console.warn('No onChange handler set')

  addInfoMessage(message: string): void {
    this.addMessage('info', message)
  }

  addErrorMessage(message: string): void {
    console.warn('[ERROR] AppMessage:', message)
    this.addMessage('error', message)
  }

  removeMessage(id: string): void {
    this.messages = this.messages.filter((message) => message.id !== id)
    this.onChange(this.messages)
  }

  setOnChange(onChange: OnChangeHandler): void {
    this.onChange = onChange
  }

  private addMessage(type: MessageType, message: string): void {
    const id = crypto.randomUUID()
    this.messages = [{ id, type, message }, ...this.messages]
    this.onChange(this.messages)
  }
}

export const AppMessage = new AppMessageClass()
