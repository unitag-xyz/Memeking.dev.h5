import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import Image from 'next/image'
import { useEffect } from 'react'

import CloseIcon from '@/assets/images/close.svg'
import Corner from '@/assets/images/corner.svg'

function Dot() {
  return <div className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#FF8000]" />
}

export default function DetailDialog() {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    onOpen()
  }, [])

  return (
    <Modal
      classNames={{
        wrapper: 'overflow-y-hidden',
        base: 'flex flex-col gap-y-[24px] w-full tablet:w-[560px] h-fit max-h-[90%] py-[40px] bg-[#FFEFD4] !rounded-[12px] max-w-[1000px] leading-normal',
      }}
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="shrink-0 p-0 px-[40px]">
          <div className="e2 w-full text-center text-[24px]">Learn more</div>
        </ModalHeader>
        <ModalBody className="flex w-full flex-col gap-y-[24px] overflow-y-auto px-[40px] text-[18px]">
          <div className="flex flex-col gap-y-[10px]">
            <div className="font-semibold text-[#FF8000]">Memeking Ranks:</div>
            <div>
              MemeKing has three ranks based on your on-chain memecoin trading adventure, each with
              unique $MMK rewards and minting fees:
            </div>
            <div className="space-y-[10px]">
              <div className="flex gap-x-[10px] gap-y-[4px] font-semibold max-md:flex-col md:items-center">
                <div className="flex items-center gap-x-[10px]">
                  <Dot />
                  <div className="w-[110px]">MemeKing</div>
                </div>
                <div className="flex h-[40px] w-[300px] items-center rounded-[12px] border border-solid border-[#563B00] bg-white px-[20px]">
                  300,000 $MMK for 0.05 SOL
                </div>
              </div>
              <div className="flex gap-x-[10px] gap-y-[4px] font-semibold max-md:flex-col md:items-center">
                <div className="flex items-center gap-x-[10px]">
                  <Dot />
                  <div className="w-[110px]">MemeFan</div>
                </div>
                <div className="flex h-[40px] w-[300px] items-center rounded-[12px] border border-solid border-[#563B00] bg-white px-[20px]">
                  100,000 $MMK for 0.025 SOL
                </div>
              </div>
              <div className="flex gap-x-[10px] gap-y-[4px] font-semibold max-md:flex-col md:items-center">
                <div className="flex items-center gap-x-[10px]">
                  <Dot />
                  <div className="w-[110px]">MemeNoob</div>
                </div>
                <div className="flex h-[40px] w-[300px] items-center rounded-[12px] border border-solid border-[#563B00] bg-white px-[20px]">
                  30,000 $MMK for 0.01 SOL
                </div>
              </div>
            </div>
            <div>
              Don’t worry about your current rank! Continue your meme journey to upgrade your
              MemeKing SBT and unlock more $MMK.
            </div>
          </div>
          <div className="flex flex-col gap-y-[10px]">
            <div className="font-semibold text-[#FF8000]">$MMk token:</div>
            <div>
              $MMK is the first memecoin on Memeking.Club, fairly distributed with no Dev & VC
              allocation — all tokens are airdropped to meme lovers and MMK supporters.
            </div>
          </div>
          <div className="flex flex-col gap-y-[10px]">
            <div className="font-semibold text-[#FF8000]">MemeKing SBT:</div>
            <div>
              The Memeking SBT is a gift for users who grab $MMK tokens, symbolizing the identity of
              meme enthusiasts.
            </div>
            <div>
              MemeAirdrop & Launchpad will airdrop to SBT holders, helping each memecoin find
              targeted users and supporting community growth.
            </div>
          </div>
          <div className="flex flex-col gap-y-[10px]">
            <div className="font-semibold text-[#FF8000]">Using SOL and EVM Addresses:</div>
            <div>
              Memeking.club is a multi-chain service-oriented Launchpad. By providing your EVM
              address, you can receive future EVM airdrops.
            </div>
          </div>
          <div className="flex flex-col gap-y-[10px]">
            <div className="font-semibold text-[#FF8000]">Collected Fees Go Towards:</div>
            <div className="flex items-center gap-x-[10px]">
              <Dot />
              <div>Developing new tools to continuously empower memeking.club.</div>
            </div>
            <div className="flex items-center gap-x-[10px]">
              <Dot />
              <div>Adding liquidity for $MMK.</div>
            </div>
          </div>
        </ModalBody>
        <Corner width={124} className="absolute left-0 top-0 -z-20" />
        <Corner width={124} className="absolute right-0 top-0 -z-20 rotate-90" />
        <Corner width={124} className="absolute bottom-0 right-0 -z-20 rotate-180" />
        <Corner width={124} className="absolute bottom-0 left-0 -z-20 -rotate-90" />
        <CloseIcon
          className="absolute right-[16px] top-[12px] z-50 cursor-pointer"
          onClick={onClose}
        />
      </ModalContent>
    </Modal>
  )
}
