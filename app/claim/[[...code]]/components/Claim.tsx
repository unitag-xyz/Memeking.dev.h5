'use client'

import { WalletSendTransactionError } from '@solana/wallet-adapter-base'
import { ReactNode, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

import { submitCloseTransaction } from '@/apis/claim'
import Close from '@/assets/images/claim/close.svg'
import Copy from '@/assets/images/claim/copy.svg'
import Icon1 from '@/assets/images/claim/icon1.svg'
import Icon2 from '@/assets/images/claim/icon2.svg'
import Icon3 from '@/assets/images/claim/icon3.svg'
import Left from '@/assets/images/claim/left.svg'
import ManLeft from '@/assets/images/claim/man-left.svg'
import ManRight from '@/assets/images/claim/man-right.svg'
import Open from '@/assets/images/claim/open.svg'
import Right from '@/assets/images/claim/right.svg'
import Share from '@/assets/images/claim/share.svg'
import X from '@/assets/images/claim/x.svg'
import Star from '@/assets/images/star.svg'
import Button from '@/components/Button'
import OnlyClient from '@/components/OnlyClient'
import { OutsideClick } from '@/components/OutsideClick'
import { PER_ACCOUNT_POINT } from '@/constants/point'
import useAccount from '@/hooks/use-account'
import useAuth from '@/hooks/use-auth'
import useClaim from '@/hooks/use-claim'
import useError from '@/hooks/use-error'
import { useModal } from '@/hooks/use-modal'
import useShareX from '@/hooks/use-share-x'
import { lamportsToSol } from '@/utils/converts'
import { beautifyAddress, formatSol } from '@/utils/formaters'
import { getWindow } from '@/utils/window'

const informations = [
  {
    title: 'Closing SPL Token Accounts',
    detail:
      'Every time you receive a meme token, a unique account is created in your wallet. When you trade or send that token, the account remains empty and useless, but it still consumes resources. Creating each of these accounts costs about 0.002 SOL in rent, which is held by the network permanently unless you take action.',
  },
  {
    title: 'Claim Your SOL',
    detail:
      'Every time you receive a meme token, a unique account is created in your wallet. When you trade or send that token, the account remains empty and useless, but it still consumes resources. Creating each of these accounts costs about 0.002 SOL in rent, which is held by the network permanently unless you take action.',
  },
  {
    title: 'What Is This Rent?',
    detail:
      'Every time you receive a meme token, a unique account is created in your wallet. When you trade or send that token, the account remains empty and useless, but it still consumes resources. Creating each of these accounts costs about 0.002 SOL in rent, which is held by the network permanently unless you take action.',
  },
]

function Information({ title, detail }: { title: string; detail: string }) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[12px] bg-[#FFE3B1]">
      <div
        className="flex cursor-pointer items-center justify-between bg-[#FFCF7D] p-[20px]"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className="p1">{title}</div>
        {isOpen ? <Close /> : <Open />}
      </div>
      {isOpen && <div className="p-[20px]">{detail}</div>}
    </div>
  )
}

function ButtonMenuItem({
  children,
  ...props
}: { children: ReactNode } & React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={twMerge('p2 cursor-pointer px-[2px] py-[10px] text-center', props.className)}
    >
      {children}
    </div>
  )
}

function AddressButton() {
  const { publicKey, isLogin, login, logout } = useAuth()

  const [isMenu, setIsMenu] = useState(false)
  return (
    <>
      {isLogin ? (
        <div className="relative">
          <Button
            className="h-[60px] w-[240px]"
            isShadow
            onPress={() => setIsMenu((isMenu) => !isMenu)}
          >
            <div className="h3">{beautifyAddress(publicKey?.toBase58() ?? '')}</div>
          </Button>
          {isMenu && (
            <OutsideClick
              onOutsideClick={() => setIsMenu(false)}
              className="absolute left-0 right-0 top-[80px] z-[100] mx-auto w-max rounded-[12px] border border-[#563B00] bg-[#FFEFD4] p-[20px] shadow-[0px_4px_4px_0px_#563B00]"
            >
              <ButtonMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(publicKey?.toBase58() ?? '')
                  toast.success('Copied')
                  setIsMenu(false)
                }}
              >
                Copy Address
              </ButtonMenuItem>
              <ButtonMenuItem
                onClick={() => {
                  login({
                    isDisconnect: false,
                  })
                  setIsMenu(false)
                }}
              >
                Change Wallet
              </ButtonMenuItem>
              <ButtonMenuItem
                className="cursor-pointer text-point"
                onClick={() => {
                  logout()
                  setIsMenu(false)
                }}
              >
                Logout
              </ButtonMenuItem>
            </OutsideClick>
          )}
        </div>
      ) : (
        <Button className="h-[60px] w-[240px]" onPress={login} isShadow>
          Connect
        </Button>
      )}
    </>
  )
}

export function Claim() {
  const { openTwitterShareWindow } = useShareX({
    text: 'share',
    url: typeof window === 'undefined' ? '' : window.location.href,
  })

  const { balance } = useClaim()

  const { isLogin } = useAuth()
  const { account } = useAccount()

  const { emptyTokenAccounts, totalSOLToClaim, claimTokenAccount } = useClaim()
  const { showComing, showSuccess } = useModal()

  const { handleError } = useError()

  const claimAll = useCallback(async () => {
    if (emptyTokenAccounts?.length === 0) {
      toast.error('Nothing to claim in this wallet!')
      return
    }

    const closeLoading = showComing({
      title: 'GRAB YOUR SOL',
      msg: 'Waiting for your confirmation to grab SOL & Memeking Point',
    })

    try {
      await claimTokenAccount()

      showSuccess({
        title: 'CONGRATULATION',
        content: (
          <>
            <div>
              Claim successful! Don&apos;t forget to refer your friends and receive 40% of the
              included donations and Memeking Points.
            </div>
          </>
        ),
        footer: <Button onPress={openTwitterShareWindow}>Share to X</Button>,
      })
    } catch (error) {
      try {
        handleError(error)
      } catch {
        toast.error('Could not submit claim, requested resource not available.')
      }
    } finally {
      closeLoading()
    }
  }, [
    claimTokenAccount,
    emptyTokenAccounts?.length,
    handleError,
    openTwitterShareWindow,
    showComing,
    showSuccess,
  ])

  return (
    <div className="relative">
      <ManLeft className="absolute left-0 top-0 -z-20 max-md:hidden" />
      <ManRight className="absolute right-0 top-[400px] -z-20" />
      <div className="px-[20px]">
        <div className="mt-[40px] flex flex-col items-center text-center">
          <div className="p1 mb-[10px] capitalize">Solana Blockchain Keeps Your SOL!</div>
          <h1 className="mb-[20px] flex gap-x-4 capitalize max-lg:flex-col">
            <div className="e3">Memeking</div>
            <div className="e1">Helps you get it back !</div>
          </h1>
          <div className="mb-[20px] flex items-center justify-center gap-x-[10px]">
            <Icon1 />
            <div className="h2">=</div>
            <Icon2 />
            <div className="h2">=</div>
            <Icon3 />
          </div>
          <div className="mb-[35px] flex w-full items-center justify-center gap-[20px] max-md:flex-col">
            <div className="w-full max-w-[400px] rounded-lg border-2 border-[#563B00] bg-background px-[20px] py-[10px] shadow-[0px_4px_0px_0px_#563B00]">
              <div className="h3">Claimed Memeking Point</div>
              <div className="flex items-center justify-center text-point">
                <span className="h2 mr-[10px]">{account ? account.closedAccountPoints : '-'}</span>
                <span className="h3">Point</span>
              </div>
            </div>
            <div className="w-full max-w-[400px] rounded-lg border-2 border-[#563B00] bg-background px-[20px] py-[10px] shadow-[0px_4px_0px_0px_#563B00]">
              <div className="h3">Total Sol Recovered</div>
              <div className="flex items-center justify-center text-point">
                <span className="h2 mr-[10px]">
                  {account ? formatSol(lamportsToSol(account.reclaimedSols)) : '-'}
                </span>
                <span className="h3">Sol</span>
              </div>
            </div>
          </div>
          <div className="mb-[20px] flex items-center">
            <AddressButton />
            <Share className="cursor-pointer" onClick={openTwitterShareWindow} />
          </div>
          <div className="flex items-center gap-x-[10px] max-md:flex-col">
            <div className="flex items-center gap-x-[10px]">
              <span>BALANCE</span>
              <span className="font-semibold text-point">
                {formatSol(lamportsToSol(balance ?? 0))} SOL
              </span>
            </div>
            {/* <div className="h-[14px] w-[1px] bg-main max-md:hidden"></div>
              <div className="flex items-center gap-x-[10px]">
                <span>Memeking point</span>
                <span className="font-semibold text-point">0.012345 Point</span>
              </div> */}
          </div>
          <div>Refer your friends and receive 40% of the included donation & Memeking Point</div>
          <div className="mb-[30px] flex items-center">
            <OnlyClient>
              <div className="anywhere mr-2 text-point">{getWindow()?.location.href}</div>
            </OnlyClient>
            <Copy
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('Copied')
              }}
              className="shrink-0 cursor-pointer"
            />
            <X className="shrink-0 cursor-pointer" onClick={openTwitterShareWindow} />
          </div>
        </div>
      </div>
      {isLogin && (
        <div className="mb-[50px] px-[20px]">
          <div className="relative z-0 mx-auto w-full max-w-[1200px] overflow-hidden rounded-[12px] bg-[#FFCF7D] p-[20px]">
            <Left className="absolute left-0 top-0" />
            <Right className="absolute bottom-0 right-0 max-md:hidden" />
            <div className="relative z-50 mx-auto flex max-w-[820px] flex-col items-center">
              <div className="mb-[4px] flex w-full justify-between">
                <span className="p1">Account to close:</span>
                <span className="h3 text-point">{emptyTokenAccounts?.length}</span>
              </div>
              <div className="mb-[4px] flex w-full justify-between">
                <span className="p1">Total SOL to Claim:</span>
                <span className="h3 text-point">{formatSol(totalSOLToClaim)}</span>
              </div>
              <div className="mb-[20px] flex w-full justify-between">
                <span className="p1">Total Memeking point to Claim:</span>
                <span className="h3 text-point">
                  {PER_ACCOUNT_POINT * (emptyTokenAccounts?.length ?? 0)}
                </span>
              </div>
              <Button onPress={claimAll} isShadow className="mb-[10px]">
                CLAIM ALL <Star />
              </Button>
              <div className="capitalize">* You&apos;ll need to sign 1 chunk of transactions</div>
            </div>
          </div>
        </div>
      )}
      <h1 className="e1 mb-[20px] text-center">WTF is this?</h1>
      <div className="mb-[80px] flex flex-col gap-y-[20px] px-[20px]">
        {informations.map((information) => (
          <Information
            key={information.title}
            title={information.title}
            detail={information.detail}
          />
        ))}
      </div>
    </div>
  )
}
