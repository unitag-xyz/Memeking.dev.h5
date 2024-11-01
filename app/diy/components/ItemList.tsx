'use client'

import { type ReactNode, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import ArrowIcon from '@/assets/images/diy/arrow.svg'
import UploadIcon from '@/assets/images/diy/upload.svg'
import { formatStyleValue } from '@/modules/view'

const ITEM_GAP_X = 10

interface ArrowProps extends CustomProps {
  disable?: boolean
  onClick?: () => void
}
function Arrow({ className = '', disable, onClick = () => {} }: ArrowProps) {
  // const handleClick = useCallback(
  //   function () {
  //     if (!disable) onClick()
  //   },
  //   [disable, onClick],
  // )

  return (
    <div
      className={twMerge(
        'h-[30px] w-[30px] rounded-full bg-transparent transition-colors',
        className,
        disable
          ? 'pointer-events-none opacity-50'
          : 'cursor-pointer hover:bg-[#FFB433] focus:bg-[#FFB433]',
      )}
      onClick={onClick}
    >
      <ArrowIcon />
    </div>
  )
}

interface ItemProps extends CustomProps {
  children?: ReactNode
  itemSize: number
}
function Item({ className = '', children, itemSize }: ItemProps) {
  return (
    <div
      className={twMerge(
        'shrink-0 cursor-pointer rounded-[12px] border border-solid border-[#563B00]',
        className,
      )}
      style={{
        height: formatStyleValue(itemSize),
        width: formatStyleValue(itemSize),
      }}
    >
      {children}
    </div>
  )
}

interface ItemListProps extends CustomProps {
  items: any[]
  itemSize: number
  rows?: 1 | 2
}
export function ItemList({ className = '', items, itemSize, rows = 1 }: ItemListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const offset = useRef(0)
  const [canPrevious, setCanPrevious] = useState(false)
  const [canNext, setCanNext] = useState(true)

  function handlePrevious() {
    if (!containerRef.current || !listRef.current) return

    offset.current = Math.min(offset.current + itemSize + ITEM_GAP_X, 0)
    listRef.current.style.transform = `translateX(${formatStyleValue(offset.current)})`
    if (!canNext) setCanNext(true)
    if (offset.current >= 0) setCanPrevious(false)
  }

  function handleNext() {
    if (!containerRef.current || !listRef.current) return

    const minOffset = containerRef.current.clientWidth - listRef.current.scrollWidth
    offset.current = Math.max(offset.current - itemSize - ITEM_GAP_X, minOffset)
    listRef.current.style.transform = `translateX(${formatStyleValue(offset.current)})`
    if (!canPrevious) setCanPrevious(true)
    if (offset.current <= minOffset) setCanNext(false)
  }

  return (
    <div className={twMerge('flex w-full', className)}>
      <div className="my-auto shrink-0 pr-[10px]">
        <Arrow disable={!canPrevious} onClick={handlePrevious} />
      </div>
      <div ref={containerRef} className="w-0 min-w-0 flex-1 overflow-hidden">
        {(() => {
          if (rows === 1)
            return (
              <div
                ref={listRef}
                className={`flex items-center gap-x-[${formatStyleValue(ITEM_GAP_X)}] transition-transform`}
              >
                <Item className="flex items-center justify-center" itemSize={itemSize}>
                  <UploadIcon className="" />
                </Item>
                {items.map((item, index) => (
                  <Item key={index} itemSize={itemSize}>
                    {item}
                  </Item>
                ))}
              </div>
            )
          else if (rows === 2) return <div className={`grid grid-rows-${rows} gap-x-[10px]`}></div>
        })()}
      </div>
      <div className="my-auto shrink-0 pl-[10px]">
        <Arrow className="flip" disable={!canNext} onClick={handleNext} />
      </div>
    </div>
  )
}
