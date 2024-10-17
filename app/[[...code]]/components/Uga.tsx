import Chain from '@/assets/images/uga/chain.svg'
import Cloud from '@/assets/images/uga/cloud.svg'
import Left from '@/assets/images/uga/left.svg'
import ChainPhone from '@/assets/images/uga/phone/chain.svg'
import RevenuePhone from '@/assets/images/uga/phone/revenue.svg'
import SbtPhone from '@/assets/images/uga/phone/sbt.svg'
import ToolsPhone from '@/assets/images/uga/phone/tools.svg'
import Revenue from '@/assets/images/uga/revenue.svg'
import Right from '@/assets/images/uga/right.svg'
import Sbt from '@/assets/images/uga/sbt.svg'
import Tools from '@/assets/images/uga/tools.svg'

export default function Uga() {
  return (
    <div className="relative px-[20px] pb-[30px] pt-[80px]">
      <Left className="absolute left-0 top-0 -z-20 max-md:hidden" />
      <Right className="absolute right-0 top-0 -z-20 max-md:hidden" />
      <div className="relative mx-auto w-max">
        <Cloud className="absolute right-[-80px] top-[-65px] -z-10" />
        <h1 className="mb-[10px] flex items-center justify-center gap-[10px] max-md:flex-col">
          <div className="e3">Memeking</div>
          <div className="e1">Cultpad</div>
        </h1>
      </div>
      <p className="mb-[30px] text-center capitalize">
        Connecting meme tokens with a vast targeted group of meme degens
      </p>
      <div className="mx-auto grid aspect-[3/2] w-full max-w-[900px] grid-cols-3 grid-rows-2 gap-[30px] max-md:hidden">
        <div className="relative col-span-2 row-span-1 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[55px] text-center font-semibold">
          <Sbt className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Airdrop for SBT Holders</div>
          </div>
        </div>
        <div className="relative col-span-1 row-start-2 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[55px] text-center font-semibold">
          <Chain className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Supports Solana & EVM</div>
          </div>
        </div>
        <div className="relative col-start-2 row-start-2 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[55px] text-center font-semibold">
          <Revenue className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Platform Revenue Sharing</div>
          </div>
        </div>
        <div className="relative col-start-3 row-span-2 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[55px] text-center font-semibold">
          <Tools className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Supports Multiple Tools</div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid aspect-[2/3] w-full grid-cols-2 grid-rows-3 gap-[15px] sm:gap-[30px] md:hidden">
        <div className="relative col-span-2 row-span-1 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[30px] text-center font-semibold sm:p-[55px]">
          <SbtPhone className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Airdrop for SBT Holders</div>
          </div>
        </div>
        <div className="relative row-start-2 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[30px] text-center font-semibold sm:p-[55px]">
          <ChainPhone className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Supports Solana & EVM</div>
          </div>
        </div>
        <div className="relative row-start-3 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[30px] text-center font-semibold sm:p-[55px]">
          <RevenuePhone className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Platform Revenue Sharing</div>
          </div>
        </div>
        <div className="relative row-span-2 row-start-2 flex items-end justify-center overflow-hidden rounded-[12px] bg-[#FFDB8D] p-[30px] text-center font-semibold sm:p-[55px]">
          <ToolsPhone className="absolute bottom-0 left-0 right-0 top-0 h-full w-full" />
          <div className="z-10">
            <div>Supports Multiple Tools</div>
          </div>
        </div>
      </div>
    </div>
  )
}
