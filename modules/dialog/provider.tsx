'use client'

import type { ReactElement } from 'react'
import { createContext, useContext, useRef, useState } from 'react'

import type {
  MessageDialogComponent,
  MessageDialogOptions,
  MessageDialogType,
} from './types/dialog'
import type { MessageComponent, MessageOptions, MessageType } from './types/message'

export { ModalContext, useModalContext, ModalProvider }

type ModalContent = {
  showModal: (modal: ReactElement) => number
  removeModal: (index: number) => void

  showMessageDialog: (
    type: MessageDialogType,
    options: MessageDialogOptions,
  ) => { close: () => void }
  showTinyMessageDialog: (
    type: MessageDialogType,
    options: MessageDialogOptions,
  ) => { close: () => void }
  showMessage: (type: MessageType, options: MessageOptions) => { close: () => void }
}
const ModalContext = createContext<ModalContent>({
  showModal: () => -1,
  removeModal: () => {},
  showMessageDialog: () => {
    return {
      close: () => {},
    }
  },
  showTinyMessageDialog: () => {
    return {
      close: () => {},
    }
  },
  showMessage: () => {
    return {
      close: () => {},
    }
  },
})
const useModalContext = () => useContext(ModalContext)

interface ModalProviderProps {
  children: ReactElement
  MessageDialog?: MessageDialogComponent
  TinyMessageDialog?: MessageDialogComponent
  Message?: MessageComponent
}
function ModalProvider({
  children,
  MessageDialog,
  TinyMessageDialog,
  Message,
}: ModalProviderProps) {
  const [modals, setModals] = useState<Record<string, ReactElement>>({})
  const counter = useRef(0)

  function showModal(modal: ReactElement) {
    const index = counter.current
    setModals((prevModals) => ({
      ...prevModals,
      [counter.current]: modal,
    }))
    counter.current++

    return index
  }

  function removeModal(index: number) {
    const updatedModals = { ...modals }
    delete updatedModals[index]
    setModals(updatedModals)
  }

  function showMessageDialog(type: MessageDialogType, options: MessageDialogOptions) {
    if (!MessageDialog)
      return {
        close: () => {},
      }

    const key = showModal(MessageDialog({ type, options, onDialogClosed: () => removeModal(key) }))
    return {
      close: () => removeModal(key),
    }
  }

  function showTinyMessageDialog(type: MessageDialogType, options: MessageDialogOptions) {
    if (!TinyMessageDialog)
      return {
        close: () => {},
      }

    const key = showModal(
      TinyMessageDialog({ type, options, onDialogClosed: () => removeModal(key) }),
    )
    return {
      close: () => removeModal(key),
    }
  }

  function showMessage(type: MessageType, options: MessageOptions) {
    if (!Message)
      return {
        close: () => {},
      }

    const key = showModal(Message({ type, options, onDialogClosed: () => removeModal(key) }))
    return {
      close: () => removeModal(key),
    }
  }

  return (
    <ModalContext.Provider
      value={{ showModal, removeModal, showMessageDialog, showTinyMessageDialog, showMessage }}
    >
      {children}
      {Object.keys(modals).map((key) => (
        <div key={key}>{modals[key]}</div>
      ))}
    </ModalContext.Provider>
  )
}
