import type { ReactElement } from 'react'

export type { MessageDialogType, MessageDialogOptions, MessageDialogProps, MessageDialogComponent }

type MessageDialogType =
  | 'loading'
  | 'success'
  | 'error'
  | 'network'
  | 'coming'
  | 'confirm'
  | undefined

interface MessageDialogOptions {
  title?: string
  message: string
  prewrap?: boolean
  userClose?: boolean
  showCancel?: boolean
  showConfirm?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

interface MessageDialogProps {
  type: MessageDialogType
  options: MessageDialogOptions
  onDialogClosed?: () => void
}

type MessageDialogComponent = (props: MessageDialogProps) => ReactElement
