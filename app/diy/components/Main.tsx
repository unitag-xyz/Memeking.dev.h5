'use client'

import AddIcon from '@/assets/images/diy/add.svg'

import { useDemoContext } from '../provider'
import { ItemList } from './ItemList'
import { ComposerCanvas } from './Canvas'

export function Main() {
  const { test } = useDemoContext()
  console.log('### 1', test)

  const items = new Array(10)
  for (let i = 0; i < items.length; i++) {
    items[i] = i
  }

  function showInput() {
    console.log('### showInput')
  }

  return (
    <div className="mx-[20px] md:mx-[40px]">
      <div className="mx-auto flex max-w-[1200px]">
        <div className="w-[500px] shrink-0 bg-[linear-gradient(180deg,#FFE3B1_0%,#FFEFD4_100%)] pt-[40px]">
          <div className="space-y-[10px]">
            <ComposerCanvas className="h-[290px]" />
          </div>
        </div>
        <div className="flex-1 space-y-[30px] px-[20px] pt-[40px]">
          <div className="space-y-[10px]">
            <div className="text-[24px]">Background</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">Ornaments</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">Logo</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">Text</div>
            <div
              className={
                'flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-[12px] border border-solid border-[#563B00] bg-transparent transition-colors hover:bg-[#FFB433] focus:bg-[#FFB433]'
              }
              onClick={showInput}
            >
              <AddIcon />
            </div>
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">History</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
        </div>
      </div>
    </div>
  )
}
