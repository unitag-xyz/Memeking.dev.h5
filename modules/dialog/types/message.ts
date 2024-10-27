import type { ReactElement } from 'react'

export type { MessageType, MessageOptions, MessageProps, MessageComponent }

type MessageType = 'success' | 'warning' | 'error' | string

interface MessageOptions {
  message: string
  duration?: number
  userClose?: boolean
}

interface MessageProps {
  type: MessageType
  options: MessageOptions
  onDialogClosed?: () => void
}

type MessageComponent = (props: MessageProps) => ReactElement
