'use client'

import { string } from '@metaplex-foundation/umi/serializers'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/navbar'
import { animated, useSpring } from '@react-spring/web'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import avatar from '@/assets/images/avatar.png'
import Close from '@/assets/images/close.svg'
import Dots from '@/assets/images/dots.svg'
import Logo from '@/assets/images/logo.svg'
import Menu from '@/assets/images/menu.svg'
import Chain from '@/assets/images/menu/Chain.svg'
import Logout from '@/assets/images/menu/Logout.svg'
import BackgroundMusic from '@/components/BackgroudMusic'
import Button from '@/components/Button'
import { OutsideClick } from '@/components/OutsideClick'
import useAccount from '@/hooks/use-account'
import useAuth from '@/hooks/use-auth'
import { useModal } from '@/hooks/use-modal'
import usePart from '@/hooks/use-part'
import { useShareUrl } from '@/hooks/use-share-url'
import { beautifyAddress } from '@/utils/formaters'

function MenuItem({
  children,
  isDivider,
  ...props
}: { children: React.ReactNode; isDivider?: boolean } & React.HTMLProps<HTMLDivElement>) {
  return (
    <>
      <div
        {...props}
        className={twMerge(
          'mx-[8px] my-[12px] flex cursor-pointer items-center gap-x-[12px]',
          props.className,
        )}
      >
        {children}
      </div>
      {isDivider && <div className="h-[0.5px] bg-main"></div>}
    </>
  )
}

function ConnectButton() {
  const { isLogin, publicKey, login, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return isLogin ? (
    <div className="relative">
      <Button onPress={() => setMenuOpen(true)}>
        {beautifyAddress(publicKey?.toBase58() ?? '')}
      </Button>
      {menuOpen && (
        <OutsideClick
          onOutsideClick={() => setMenuOpen(false)}
          className="absolute right-0 top-[80px] min-w-[240px] rounded-lg border border-[#563B00] bg-[#FFEFD4] p-[20px] shadow-[0px_4px_4px_0px] shadow-main"
        >
          <div className="mb-[16px] px-[8px]">Profile</div>
          <MenuItem isDivider>
            <div className="h-[24px] w-[24px] overflow-hidden rounded-full border-[1.75px] border-main">
              <Avatar />
            </div>
            {/* <Image
              className="h-[24px] w-[24px] rounded-full border-[1.75px] border-main"
              src={avatar}
              alt="avatar"
            /> */}
            <div>{beautifyAddress(publicKey?.toBase58() ?? '')}</div>
          </MenuItem>
          <MenuItem
            onClick={() => {
              logout()
              setMenuOpen(false)
            }}
          >
            <Logout />
            <div>Logout</div>
          </MenuItem>
          {/* <MenuItem>
            <Chain />
            <div>Chain List</div>
          </MenuItem> */}
        </OutsideClick>
      )}
    </div>
  ) : (
    <Button onPress={login}>Connect</Button>
  )
}

function Item({ children, isDivider }: { children: React.ReactNode; isDivider?: boolean }) {
  return (
    <>
      <NavbarMenuItem className="p3 mx-[8px] my-[10px]">{children}</NavbarMenuItem>
      {isDivider && <div className="my-[10px] h-[0.5px] bg-brand"></div>}
    </>
  )
}

function Avatar() {
  const { account } = useAccount()

  return <>{account && <Image width={56} height={56} src={account.avatar} alt="avatar" />}</>
}

function HamburgerMenu({ children }: { children: ReactNode }) {
  const { shareUrl } = useShareUrl()
  const { showComing } = useModal()

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const { isLogin, publicKey, login, logout } = useAuth()

  const [springs, api] = useSpring(() => ({
    x: 300,
    opacity: 0,
  }))

  const open = useCallback(() => {
    setIsMenuOpen(true)
    api.start({
      x: 0,
      opacity: 1,
    })
  }, [api])

  const close = useCallback(() => {
    api.start({
      x: 300,
      opacity: 0,
      reset: true,
      onRest() {
        setIsMenuOpen(false)
      },
    })
  }, [api])

  return (
    <>
      <div onClick={open}>{children}</div>
      {isMenuOpen && (
        <animated.div
          className="fixed bottom-0 left-0 right-0 top-0 z-50 h-screen bg-[#3333] p-0 backdrop-blur-none backdrop-brightness-[0.4]"
          style={{
            opacity: springs.opacity,
          }}
          onClick={close}
        >
          <animated.div
            className="absolute right-0 h-full w-[300px] bg-background px-[16px] py-[32px]"
            style={{
              x: springs.x,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* <div onClick={(e) => e.stopPropagation()}> */}
            <Dots className="absolute right-[-150px] top-[-150px] h-[334px] w-[334px]" />
            <Close onClick={close} className="absolute right-[16px] top-[16px] cursor-pointer" />
            {isLogin ? (
              <div className="relative z-10 mx-[8px] my-[12px] mb-[32px] flex items-center gap-x-[12px]">
                {/* <Image
                className="h-[56px] w-[56px] rounded-full border-[1.75px] border-main"
                src={avatar}
                alt="avatar"
              /> */}
                <div className="h-[56px] w-[56px] overflow-hidden rounded-full border-[1.75px] border-main">
                  <Avatar />
                </div>
                <div className="font-semibol">{beautifyAddress(publicKey?.toBase58() ?? '')}</div>
              </div>
            ) : (
              <Button onPress={login}>Connect</Button>
            )}
            <Item isDivider>
              <Link href={shareUrl('/')}>Home</Link>
            </Item>
            <Item isDivider>
              <Link href={shareUrl('/claim')}>Claim SOL</Link>
            </Item>
            <Item isDivider>
              <div
                onClick={() => {
                  showComing({
                    title: 'COMING SOON!',
                    msg: 'The meme army is breaking down the door – they need to DIY',
                  })
                  setIsMenuOpen(false)
                }}
              >
                DIY
              </div>
            </Item>
            <Item>
              <div className="flex items-center justify-between">
                <div onClick={logout}>Logout</div>
                <Logout className="cursor-pointer" />
              </div>
            </Item>
            {/* </div> */}
          </animated.div>
        </animated.div>
      )}
    </>
  )
}

export default function Navigator() {
  const { shareUrl } = useShareUrl()

  const { showComing } = useModal()

  return (
    <Navbar
      classNames={{
        wrapper:
          'bg-brand md:mt-[30px] mt-[10px] rounded-[12px] max-w-[1200px] md:mx-[40px] mx-[10px] border border-main shadow-main shadow-[0_4px_0_0]',
      }}
    >
      <NavbarBrand>
        <Link href={shareUrl('/')}>
          <Logo />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-[16px] sm:flex" justify="center">
        <NavbarItem>
          <Link className="p-2" href={shareUrl('/')}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="p-2" href={shareUrl('/claim')}>
            Claim SOL
          </Link>
        </NavbarItem>
        <NavbarItem
          className="cursor-pointer p-2"
          onClick={() => {
            showComing({
              title: 'COMING SOON!',
              msg: 'The meme army is breaking down the door – they need to DIY',
            })
          }}
        >
          DIY
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="max-sm:hidden" justify="end">
        <NavbarItem>
          <BackgroundMusic />
        </NavbarItem>
        <NavbarItem>
          {/* <WalletMultiButton /> */}
          <ConnectButton />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarItem>
          <BackgroundMusic />
        </NavbarItem>
        <HamburgerMenu>
          <Menu />
        </HamburgerMenu>
      </NavbarContent>
    </Navbar>
  )
}
