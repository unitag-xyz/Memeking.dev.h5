import Image from 'next/image'

import Bg from '@/assets/images/tokens/bg.svg'
import Chart from '@/assets/images/tokens/chart.png'

export default function Tokens() {
  return (
    <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-[#FFE7BD] to-[#FFE1AD] px-[20px] py-[20px] sm:px-[40px] sm:py-[40px] md:h-[540px] lg:p-[60px]">
      <Bg className="absolute inset-y-px h-full" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1020px] items-center justify-between rounded-[12px] bg-[#FFCF7DB2] px-[20px] py-[30px] backdrop-blur-[10px] max-md:flex-col max-md:gap-y-[20px] md:gap-x-[12px] md:px-[40px] lg:px-[60px]">
        <div className="flex flex-col gap-y-[20px] md:gap-y-[40px]">
          <div className="flex flex-col gap-y-[10px] max-md:text-center">
            <h1 className="flex justify-center gap-[10px] max-xl:flex-col">
              <div className="e3">Memeking</div>
              <div className="e1">Tokenomics</div>
            </h1>
            <p className="w-full max-w-[500px]">
              <span className="font-semibold">No dev shares</span> - every token is fairly
              distributed to true meme lovers only
            </p>
          </div>
          <div className="flex flex-col gap-y-[10px] max-md:items-center">
            <div className="flex items-center">
              <div className="h-[40px] w-[40px] p-[10px]">
                <div className="h-[20px] w-[20px] rounded-full bg-[#FFA725]" />
              </div>
              <div className="flex gap-x-[10px] font-semibold capitalize">
                <p>airdrop</p>
                <p className="strokeshadow-brown-2 text-white">80%</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-[40px] w-[40px] p-[10px]">
                <div className="h-[20px] w-[20px] rounded-full bg-[#FF8000]" />
              </div>
              <div className="flex gap-x-[10px] font-semibold capitalize">
                <p>liquidity pool</p>
                <p className="strokeshadow-brown-2 text-white">20%</p>
              </div>
            </div>
          </div>
        </div>
        <Image className="shrink-0" src={Chart} alt="chart" />
      </div>
    </div>
  )
}
