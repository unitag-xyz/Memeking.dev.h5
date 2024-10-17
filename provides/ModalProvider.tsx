'use client'

import clsx from 'clsx'
import { ReactNode, createContext, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Close from '@/assets/images/close.svg'
import Dots from '@/assets/images/dots.svg'
import Button from '@/components/Button'

export type ModalProps = {
  icon?: ReactNode
  title?: string
  msg?: string
  content?: ReactNode
  onClose?: () => void
  onComfirm?: () => void
  footer?: ReactNode
}

type Modal = {
  id: string
} & ModalProps

interface ModalContextType {
  modals: Modal[]
  showModal: (modal: ModalProps) => () => void
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([])
  const [visible, setVisible] = useState(false)

  const closeModal = useCallback((id: string) => {
    setVisible(false)
    setTimeout(() => {
      setModals((modals) => {
        return modals.filter((modal) => modal.id !== id)
      })
    }, 300)
  }, [])

  return (
    <ModalContext.Provider
      value={{
        modals,
        showModal: (modal: ModalProps) => {
          const id = uuidv4()
          setModals((modals) => [
            ...modals,
            {
              id,
              ...modal,
            },
          ])

          setTimeout(() => {
            setVisible(true)
          }, 50)

          return () => closeModal(id)
        },
      }}
    >
      {modals.length > 0 && (
        <div
          onClick={() => closeModal(modals[modals.length - 1].id)}
          className={clsx(
            'fixed bottom-0 left-0 right-0 top-0 z-50 bg-[#0008] transition-opacity',
            {
              'opacity-0': !visible,
              'opacity-100': visible,
            },
          )}
        >
          {modals.map((modal, index) => (
            <div
              onClick={(e) => e.stopPropagation()}
              key={modal.id}
              className="absolute bottom-0 left-0 right-0 m-auto h-max w-[560px] max-w-full overflow-hidden rounded-[12px] bg-[#FFEFD4] px-[48px] py-[16px] sm:top-0"
              style={{
                zIndex: index,
              }}
            >
              <Close
                className="absolute right-[16px] top-[12px] z-50 cursor-pointer"
                onClick={() => closeModal(modal.id)}
              />
              <Dots className="absolute bottom-0 left-0 right-0 top-0 m-auto w-[340px] opacity-50" />
              <div className="relative z-10 flex min-h-[300px] flex-col">
                <div className="flex grow flex-col items-center justify-center">
                  <div
                    className={clsx({
                      'mb-[20px]': !modal.title,
                    })}
                  >
                    {modal.icon}
                  </div>
                  {modal.title && <div className="e2 h3 mb-[20px] text-center">{modal.title}</div>}
                  {modal.msg && <div className="p2 mb-[20px] text-center">{modal.msg}</div>}
                  {modal.content && <div className="mb-[20px]">{modal.content}</div>}
                </div>
                {/* footer */}
                {(modal.onClose || modal.onComfirm || modal.footer) && (
                  <div className="mb-[30px] flex justify-center gap-x-[16px]">
                    {modal.footer}
                    {modal.onClose && (
                      <Button
                        isShadow
                        className="bg-white"
                        onPress={async () => {
                          await modal.onClose?.()

                          closeModal(modal.id)
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    {modal.onComfirm && (
                      <Button
                        isShadow
                        onPress={async () => {
                          await modal.onComfirm?.()

                          closeModal(modal.id)
                        }}
                      >
                        Ok
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  )
}
