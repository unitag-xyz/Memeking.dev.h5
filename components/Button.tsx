import clsx from 'clsx'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Button({
  children,
  onPress,
  isShadow,
  ...props
}: {
  children: React.ReactNode
  onPress?: () => void
  isShadow?: boolean
} & React.HTMLProps<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div
      {...props}
      onClick={async () => {
        if (isLoading) return

        try {
          setIsLoading(true)
          await onPress?.()
        } finally {
          setIsLoading(false)
        }
      }}
      className={twMerge(
        clsx(
          'p2 flex h-[40px] w-max cursor-pointer items-center justify-center rounded-[12px] border border-main bg-primary px-[20px] py-[6.5px] shadow-main',
          {
            'shadow-[0_4px_0_0] shadow-main': isShadow,
            'bg-primary': !isLoading,
            'bg-[#ababab]': isLoading,
          },
        ),
        props.className,
      )}
    >
      {children}
    </div>
  )
}
