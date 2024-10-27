'use client'

import clsx from 'clsx'
import { ReactNode, createContext, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Close from '@/assets/images/close.svg'
import Left from '@/assets/images/congratulation/left.svg'
import Right from '@/assets/images/congratulation/right.svg'
import Title from '@/assets/images/congratulation/title.svg'
import Dots from '@/assets/images/dots.svg'

export type ModalProps = {
  content?: ReactNode
}

type Modal = {
  id: string
} & ModalProps

interface ModalContextType {
  modals: Modal[]
  showModal: (modal: ModalProps) => () => void
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function CongratulationModalProvider({ children }: { children: ReactNode }) {
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
              className="absolute bottom-0 left-0 right-0 m-auto h-max w-[560px] max-w-full sm:top-0"
              style={{
                zIndex: index,
              }}
            >
              <Title className="absolute left-0 right-0 top-[-100px] z-30 m-auto w-[350px] sm:top-[-150px] sm:w-[444px]" />
              <div className="e2 absolute top-[-5px] z-50 w-full text-center text-[18px] uppercase sm:top-[-35px] sm:text-[24px]">
                Congratulation
              </div>
              <div className="relative h-max overflow-hidden rounded-[12px] bg-[#FFEFD4] px-[80px] py-[16px]">
                <Close
                  className="absolute right-[16px] top-[12px] z-50 cursor-pointer"
                  onClick={() => closeModal(modal.id)}
                />
                <Dots className="absolute bottom-0 left-0 right-0 top-0 m-auto w-[340px] opacity-50" />
                <Left className="absolute bottom-0 left-0 z-40" />
                <Right className="absolute bottom-0 right-0 z-40" />
                <div className="relative z-50 flex min-h-[260px] flex-col justify-center">
                  {modal.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  )
}
