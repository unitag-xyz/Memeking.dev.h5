import { Progress } from '@nextui-org/progress'
import clsx from 'clsx'
import Image from 'next/image'

import arb from '@/assets/images/sbt/arb.png'
import DotsLittle from '@/assets/images/sbt/dots-little.svg'
import runestone from '@/assets/images/sbt/runestone.png'
import sol from '@/assets/images/sbt/sol.png'
import Thumb from '@/assets/images/sbt/thumb.svg'
import trump from '@/assets/images/trump.png'

const holders = [
  {
    name: 'SOL Mobile',
    airdrop: 500,
    image: sol,
  },
  {
    name: 'ARB Airdrop',
    airdrop: 2000,
    image: arb,
  },
  {
    name: 'Runestone',
    airdrop: 5000,
    image: runestone,
  },
  {
    name: 'Memeking SBT',
    airdrop: 10000,
    image: trump,
    isThumb: true,
  },
]

export default function Sbt() {
  return (
    <div className="flex flex-col items-center overflow-hidden bg-gradient-to-b from-[#ffe6bd] to-[#ffdfa9] py-[30px]">
      <div className="mb-[10px]">
        <span className="e3 h1 mr-[10px]">MEMEKING</span>
        <span className="h1 e1">SBT</span>
      </div>
      <p className="px-[20px] text-center capitalize">
        Swap One McDonald’s Meal for Crypto’s Most Valuable Identity!
      </p>
      <div className="mx-auto grid w-full max-w-[1230px] grid-cols-2 items-end gap-y-[10px] md:grid-cols-4">
        {holders.map((holder) => (
          <div key={holder.name} className="flex shrink-0 flex-col items-center">
            <div className="relative flex aspect-square items-center justify-center p-[20px] sm:p-[60px] md:p-[20px] lg:p-[60px]">
              <DotsLittle
                className={clsx('absolute', {
                  'text-[#FFBB47]': !holder.isThumb,
                  'text-[#FF8000]': holder.isThumb,
                })}
              />
              {holder.isThumb && <Thumb className="absolute right-[-10px] top-[-10px]" />}
              <Image
                className={clsx('z-10', {
                  'h-[120px] w-[120px]': !holder.isThumb,
                  'h-[160px] w-[160px] sm:h-[180px] sm:w-[180px]': holder.isThumb,
                })}
                src={holder.image}
                alt={holder.name}
              />
            </div>
            <div className="mb-[10px] text-[24px] font-semibold">{holder.name}</div>
            <Progress
              className="mb-[10px] w-[120px] sm:w-[200px] md:w-[120px] lg:w-[200px]"
              classNames={{
                track: 'border border-main bg-white',
                indicator: clsx('outline outline-main', {
                  'bg-[#FF8000]': holder.isThumb,
                }),
              }}
              aria-label={holder.name}
              value={(holder.airdrop / 10000) * 100}
            />
            <div>Airdrop: ${holder.airdrop}+</div>
          </div>
        ))}
      </div>
    </div>
  )
}
