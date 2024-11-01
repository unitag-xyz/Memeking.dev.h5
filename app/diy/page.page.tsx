import { Main } from './components/Main'
import { DemoProvider } from './provider'

export default function Page() {
  return (
    <DemoProvider>
      <Main />
    </DemoProvider>
  )
}
