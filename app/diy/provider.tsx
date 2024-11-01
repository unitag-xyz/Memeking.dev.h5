'use client'

import { createContext, useContext, useState } from 'react'

export { useDemoContext, DemoProvider }

type Test = {
  a: string
  b: string
  c: string
}

type DemoContent = {
  test: Test
  setTest: (value: Test) => void
}

interface DemoProviderProps {
  children: React.ReactNode
}

const DemoContext = createContext<DemoContent>({
  test: {
    a: '',
    b: '',
    c: '',
  },
  setTest: () => {},
})
const useDemoContext = () => useContext(DemoContext)

const DemoProvider = ({ children }: DemoProviderProps) => {
  const [test, setTest] = useState<Test>({
    a: '',
    b: '',
    c: '',
  })

  return (
    <DemoContext.Provider
      value={{
        test,
        setTest,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}
