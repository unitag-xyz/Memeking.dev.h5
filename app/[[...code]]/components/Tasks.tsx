'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'

import DotsRow from '@/assets/images/dots-row.svg'
import Star from '@/assets/images/star.svg'
import Check from '@/assets/images/tasks/check.svg'
import Claim from '@/assets/images/tasks/claim.svg'
import Crown from '@/assets/images/tasks/crown.svg'
import Invite from '@/assets/images/tasks/invite.svg'
import Button from '@/components/Button'
import useAccount from '@/hooks/use-account'
import useAuth from '@/hooks/use-auth'
import { useShareUrl } from '@/hooks/use-share-url'
import useShareX from '@/hooks/use-share-x'

function Task({
  index,
  icon,
  text,
  label,
  point,
  isCompleted,
  onPress,
}: {
  index: number
  text: string
  point?: number
  label: string
  icon: React.ReactNode
  isCompleted: boolean
  onPress: () => void
}) {
  return (
    <div key={index} className="flex gap-x-[20px] rounded-[12px] bg-[#FFEFD4] p-[10px] md:p-[20px]">
      <div className="shrink-0">{icon}</div>
      <div className="flex grow flex-col justify-between">
        <div className="flex items-center gap-x-[4px]">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1px] border-main bg-[#FFA725] capitalize">
            {index}
          </div>
          <div className="p1">{text}</div>
        </div>
        <div
          className={clsx('flex items-center', {
            'justify-between': point !== undefined,
            'justify-end': point === undefined,
          })}
        >
          {point !== undefined && <h3 className="font-semibold text-[#FF8000]">{point} $MMK</h3>}
          {isCompleted ? (
            <Button isShadow className="h-[50px] bg-[#ababab] capitalize lg:w-[200px]">
              Done
            </Button>
          ) : (
            <Button isShadow onPress={onPress} className="h-[50px] capitalize lg:w-[200px]">
              {label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckTask() {
  const { isLogin, login } = useAuth()
  const { account } = useAccount()

  return (
    <Task
      label="Check"
      icon={<Check />}
      text="Check Your Memeking Level"
      point={account?.sbtPoints}
      index={1}
      isCompleted={isLogin}
      onPress={login}
    />
  )
}

function ClaimTask() {
  const { account } = useAccount()
  const router = useRouter()
  const { shareUrl } = useShareUrl()

  return (
    <Task
      label="Claim"
      icon={<Claim />}
      text="Claim Your Sol & Get $MMK"
      point={account?.closedAccountPoints}
      index={2}
      isCompleted={false}
      onPress={() => router.push(shareUrl('/claim'))}
    />
  )
}

function InviteTask() {
  const { account } = useAccount()
  const { openTwitterShareWindow } = useShareX()

  return (
    <Task
      label="Share"
      icon={<Invite />}
      text="invite get 10% referral $MMK"
      point={account?.refferalPoints}
      index={3}
      isCompleted={false}
      onPress={() => openTwitterShareWindow()}
    />
  )
}

export default function Tasks() {
  const { account } = useAccount()
  return (
    <>
      <div id="tasks" className="scroll-mt-[100px] bg-[#FFDFA9] px-[20px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between pb-[30px] pt-[60px] max-md:flex-col">
          <div className="relative w-full max-w-[478px] grow">
            <Crown />
            <div className="absolute bottom-[105px] w-full text-center">
              <div className="h2 e4">
                {account
                  ? account.sbtPoints + account.closedAccountPoints + account.refferalPoints
                  : '-'}
              </div>
              <div className="p1">Token</div>
            </div>
            <div className="flex justify-center">
              <Star />
              <p className="text-center max-md:mb-[10px]">Join Telegram to get more $MMK</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-[10px]">
            <CheckTask />
            <ClaimTask />
            <InviteTask />
            {/* {tasks.map((task, index) => (
              <div
                key={index}
                className="flex gap-x-[20px] rounded-[12px] bg-[#FFEFD4] p-[10px] md:p-[20px]"
              >
                <task.iocn className="shrink-0" />
                <div className="flex grow flex-col justify-between">
                  <div className="flex items-center gap-x-[4px]">
                    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1px] border-main bg-[#FFA725] capitalize">
                      {index + 1}
                    </div>
                    <div className="p1">{task.text}</div>
                  </div>
                  <div
                    className={clsx('flex items-center', {
                      'justify-between': isLogin,
                      'justify-end': !isLogin,
                    })}
                  >
                    {isLogin && (
                      <h3 className="font-semibold text-[#FF8000]">{task.point} point</h3>
                    )}
                    <Button isShadow className="h-[50px] capitalize lg:w-[200px]">
                      {task.label}
                    </Button>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
      <div className="flex justify-center overflow-hidden">
        <DotsRow className="min-w-[600px] bg-[#ffe7bd]" />
      </div>
    </>
  )
}
