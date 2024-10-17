import clsx from 'clsx'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

import { DynaPuffFont } from '@/font'
import { SupercellMagicFont } from '@/font'
import AppWalletProvider from '@/provides/AppWalletProvider'
import BackgroundMusicProvider from '@/provides/BackgroundMusicProvider'
import { CongratulationModalProvider } from '@/provides/CongratulationModalProvider'
import InitProvider from '@/provides/InitProvider'
import { ModalProvider } from '@/provides/ModalProvider'
import RainProvider from '@/provides/RainProvider'

import Footer from './components/Footer'
import Navigator from './components/Navigator'
import './globals.css'

export const metadata: Metadata = {
  title: 'Freesia',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={clsx(
        'bg-background text-[18px] leading-[1.5] tracking-[0.36px] text-main',
        DynaPuffFont.className,
        SupercellMagicFont.variable,
      )}
    >
      <body className="select-none">
        <RainProvider>
          <AppWalletProvider>
            <CongratulationModalProvider>
              <ModalProvider>
                <InitProvider>
                  <BackgroundMusicProvider>
                    <Navigator />
                    {children}
                    <Footer />
                  </BackgroundMusicProvider>
                </InitProvider>
              </ModalProvider>
            </CongratulationModalProvider>
          </AppWalletProvider>
        </RainProvider>
        <Toaster
          toastOptions={{
            className:
              '!rounded-[12px] !border !border-[#563B00] !bg-[#FFEFD4] !shadow-[0_4px_0_0_#563B00]',
          }}
        />
      </body>
    </html>
  )
}
