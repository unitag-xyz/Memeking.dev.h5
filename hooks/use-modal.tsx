import Image from 'next/image'
import { useCallback, useContext } from 'react'

import Coming from '@/assets/images/modal/coming.svg'
import Error from '@/assets/images/modal/error.svg'
import loading from '@/assets/images/modal/loading.png'
import Network from '@/assets/images/modal/network.svg'
import Success from '@/assets/images/modal/success.svg'
import { ModalContext, ModalProps } from '@/provides/ModalProvider'

export function useModal() {
  const context = useContext(ModalContext)!

  const showMessage = useCallback(
    (props: ModalProps) => {
      return context.showModal(props)
    },
    [context],
  )

  const showLoading = useCallback(
    (props?: ModalProps) => {
      return context.showModal({
        ...props,
        icon: (
          <Image
            className="mb-[10px] animate-spin"
            width={80}
            height={80}
            src={loading}
            alt="loading"
          />
        ),
        title: props?.title ?? 'LOADING',
      })
    },
    [context],
  )

  const showSuccess = useCallback(
    (props?: ModalProps) => {
      return context.showModal({
        ...props,
        icon: <Success />,
        title: props?.title ?? 'SUCCESS',
      })
    },
    [context],
  )

  const showNetwork = useCallback(
    (props?: ModalProps) => {
      return context.showModal({
        ...props,
        icon: <Network />,
        title: props?.title ?? 'NETWORK',
      })
    },
    [context],
  )

  const showComing = useCallback(
    (props?: ModalProps) => {
      return context.showModal({
        ...props,
        icon: <Coming />,
        title: props?.title ?? 'COMING SOON!',
      })
    },
    [context],
  )

  const showError = useCallback(
    (props?: ModalProps) => {
      return context.showModal({
        ...props,
        icon: <Error />,
        title: props?.title ?? 'ERROR',
      })
    },
    [context],
  )

  return {
    showMessage,
    showLoading,
    showSuccess,
    showNetwork,
    showComing,
    showError,
  }
}
