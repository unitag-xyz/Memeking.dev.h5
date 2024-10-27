import { useCallback, useContext } from 'react'

import Button from '@/components/Button'
import { ModalContext, ModalProps } from '@/provides/CongratulationModalProvider'

import useShareX from './use-share-x'

export function useCongratulationModal() {
  const { openTwitterShareWindow } = useShareX()

  const context = useContext(ModalContext)!

  const showMintCongratulation = useCallback(
    ({ title, point }: { title: string; point: number }) => {
      return context.showModal({
        content: (
          <div className="flex flex-col items-center">
            <div className="e1 mb-[10px] text-[20px] uppercase">YOU ARE NOW</div>
            <div className="e3 h3 mb-[10px] capitalize">{title}</div>
            <div className="mb-[20px] text-center text-[20px]">
              <div>Welcome to MemekingClub, </div>
              <div>You own {point} $MMK now ! </div>
              {/* Successfully unlocked an extra {point} $MMK */}
            </div>
            <Button className="w-[200px] capitalize" onPress={openTwitterShareWindow} isShadow>
              Share To X
            </Button>
          </div>
        ),
      })
    },
    [context, openTwitterShareWindow],
  )

  return {
    showMintCongratulation,
  }
}
