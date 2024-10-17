import React, { useEffect, useRef } from 'react'

export function OutsideClick({
  onInsideClick,
  onOutsideClick,
  children,
  ...divProps
}: React.HTMLProps<HTMLDivElement> & {
  onInsideClick?: () => void
  onOutsideClick: () => void
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [onOutsideClick])

  return (
    <div ref={wrapperRef} {...divProps} onClick={onInsideClick}>
      {children}
    </div>
  )
}
