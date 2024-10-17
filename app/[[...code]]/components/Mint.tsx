'use client'

import { Input } from '@nextui-org/input'
import { ethers } from 'ethers'
import NextImage from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import useSWRImmutable from 'swr/immutable'
import { twMerge } from 'tailwind-merge'

import Crown from '@/assets/images/crown.svg'
import Dots from '@/assets/images/dots.svg'
import Memes from '@/assets/images/memes.svg'
import Left from '@/assets/images/mint/left.svg'
import Random from '@/assets/images/mint/random.svg'
import Right from '@/assets/images/mint/right.svg'
import Share from '@/assets/images/mint/share.svg'
import Spatter from '@/assets/images/spatter.svg'
import Button from '@/components/Button'
import { ErrorDuplicateEVMAddresses } from '@/error'
import useAccount from '@/hooks/use-account'
import useAuth from '@/hooks/use-auth'
import { useCongratulationModal } from '@/hooks/use-congratulation-modal'
import useError from '@/hooks/use-error'
import useMint from '@/hooks/use-mint'
import { useModal } from '@/hooks/use-modal'
import usePart from '@/hooks/use-part'
import useShareX from '@/hooks/use-share-x'
import { loadImage } from '@/utils/image'
import { getWindow } from '@/utils/window'

function Memeking({
  onComposeDataPropsChange,
  ...props
}: {
  onComposeDataPropsChange?: (data: ComposeDataProps) => void
} & React.HTMLProps<HTMLDivElement>) {
  const devicePixelRatio = useMemo(() => getWindow()?.devicePixelRatio ?? 1, [])

  const composeRef = useRef<HTMLCanvasElement>(null)
  const shadow1Ref = useRef<HTMLCanvasElement>(null)
  const shadow2Ref = useRef<HTMLCanvasElement>(null)

  const boxRef = useRef<HTMLDivElement>(null)
  const randomRef = useRef<HTMLDivElement>(null)

  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const { randomParts, random } = usePart()
  const { openTwitterShareWindow } = useShareX()

  const { isMinted } = useAccount()

  const { data: colorYImage } = useSWRImmutable('color-y-image', () =>
    loadImage('/images/mint/color-y.png'),
  )

  const { data: mosaic1Image } = useSWRImmutable('mosaic1-image', () =>
    loadImage('/images/mint/mosaic-1.png'),
  )

  const { data: colorXImage } = useSWRImmutable('color-x-image', () =>
    loadImage('/images/mint/color-x.png'),
  )

  const { data: mosaic2Image } = useSWRImmutable('mosaic2-image', () =>
    loadImage('/images/mint/mosaic-2.png'),
  )

  const drawShadow = useCallback(
    async (
      canvas: HTMLCanvasElement,
      colorImage: HTMLImageElement,
      mosaicImage: HTMLImageElement,
      x = 0,
      y = 0,
    ) => {
      if (composeRef.current && composeRef.current.width > 0) {
        const canvasWidth = composeRef.current.width
        const canvasHeight = composeRef.current.height

        // const colorImage = await loadImage(colorSrc)
        // const mosaicImage = await loadImage(mosaicSrc)

        const context = canvas.getContext('2d')!
        context.reset()

        const tempCanvas = document.createElement('canvas') //Storage canvas
        tempCanvas.width = canvasWidth
        tempCanvas.height = canvasHeight // 设置宽高

        const tempContext = tempCanvas.getContext('2d')!

        tempContext.drawImage(composeRef.current, 0, 0, canvasWidth, canvasHeight)

        tempContext.globalCompositeOperation = 'source-in'

        tempContext.drawImage(colorImage, -800 + x * 600, -800 + y * 600, 6280, 3800)

        tempContext.globalCompositeOperation = 'destination-in'

        const imgAspectRatio = mosaicImage.width / mosaicImage.height

        let drawWidth, drawHeight

        if (canvasWidth / canvasHeight < imgAspectRatio) {
          drawHeight = canvasHeight
          drawWidth = canvasHeight * imgAspectRatio
        } else {
          drawWidth = canvasWidth
          drawHeight = canvasWidth / imgAspectRatio
        }

        tempContext.drawImage(mosaicImage, 0, 0, drawWidth, drawHeight)

        context.globalCompositeOperation = 'source-over'
        //context.globalAlpha = 0.5
        context.globalAlpha = Math.min(1.0, (Math.abs(x) + Math.abs(y)) * 2)
        context.drawImage(tempCanvas, 0, 0)
      }
    },
    [],
  )

  const normalize = useCallback(async () => {
    setRotateX(0)
    setRotateY(0)

    if (shadow1Ref.current && colorYImage && mosaic1Image)
      await drawShadow(shadow1Ref.current, colorYImage, mosaic1Image)

    if (shadow2Ref.current && colorXImage && mosaic2Image)
      await drawShadow(shadow2Ref.current!, colorXImage, mosaic2Image)
  }, [colorXImage, colorYImage, drawShadow, mosaic1Image, mosaic2Image])

  useEffect(() => {
    const boxElement = boxRef.current

    async function handleMove(event: MouseEvent) {
      if (boxElement) {
        let inRandom = false
        if (randomRef.current) {
          const randomRect = randomRef.current.getBoundingClientRect()

          if (
            event.clientX > randomRect.left &&
            event.clientX < randomRect.left + randomRect.width
          ) {
            if (
              event.clientY > randomRect.top &&
              event.clientY < randomRect.top + randomRect.height
            ) {
              inRandom = true
            }
          }
        }

        if (inRandom) {
          normalize()
        } else {
          const coreX = boxElement.getBoundingClientRect().left + boxElement.offsetWidth / 2
          const coreY = boxElement.getBoundingClientRect().top + boxElement.offsetHeight / 2

          const x = (event.clientX - coreX) / boxElement.clientWidth
          const y = (event.clientY - coreY) / boxElement.clientHeight

          setRotateX(-y * 45)
          setRotateY(x * 45)

          if (shadow1Ref.current && colorYImage && mosaic1Image)
            await drawShadow(shadow1Ref.current, colorYImage, mosaic1Image, x, y)

          if (shadow2Ref.current && colorXImage && mosaic2Image)
            await drawShadow(shadow2Ref.current!, colorXImage, mosaic2Image, x, y)
        }
      }
    }

    function handleLeve() {
      normalize()
    }

    boxElement?.addEventListener('mousemove', handleMove)

    boxElement?.addEventListener('mouseleave', handleLeve)

    return () => {
      boxElement?.removeEventListener('mousemove', handleMove)
      boxElement?.removeEventListener('mouseleave', handleLeve)
    }
  }, [colorXImage, colorYImage, drawShadow, mosaic1Image, mosaic2Image, normalize])

  const render = useCallback(async () => {
    if (composeRef.current) {
      const composeContext = composeRef.current.getContext('2d')!
      composeContext.reset()

      if (composeRef.current && composeRef.current.width > 0 && randomParts.background) {
        const background = await loadImage(randomParts.background.image)
        // console.log('background', background.width, background.height)
        if (!composeRef.current) return

        const globalScale = Math.max(
          background.width / composeRef.current.width,
          background.height / composeRef.current.height,
        )
        const backgroundCanvasX = composeRef.current.width - background.width / globalScale
        const backgroundCanvasY = composeRef.current.height - background.height / globalScale
        // console.log(
        //   'backgroundCanvasX',
        //   backgroundCanvasX,
        //   'backgroundCanvasY',
        //   backgroundCanvasY,
        // )

        const backgroundCanvas = document.createElement('canvas') //Storage canvas
        backgroundCanvas.width = background.width
        backgroundCanvas.height = background.height
        const backgroundContext = backgroundCanvas.getContext('2d')!
        // backgroundContext.fillStyle = 'grey';
        // backgroundContext.fillRect(0, 0, background.width, background.height);

        backgroundContext.drawImage(background, 0, 0)

        const drawNormalized = async (bk: HTMLCanvasElement, onePart: Part | null) => {
          if (onePart) {
            const image = await loadImage(onePart.image)
            // console.log('DrawNorm_onePart', onePart)
            backgroundCanvas
              .getContext('2d')!
              .drawImage(
                image,
                bk.width * onePart.uinvX - (image.width >> 1),
                bk.height * onePart.uinvY - (image.height >> 1),
                image.width,
                image.height,
              )
          }
        }
        await drawNormalized(backgroundCanvas, randomParts.border)
        await drawNormalized(backgroundCanvas, randomParts.logo)
        await drawNormalized(backgroundCanvas, randomParts.hat)
        await drawNormalized(backgroundCanvas, randomParts.accessory)

        if (!composeRef.current) return
        // composeContext.fillStyle = 'black';
        composeContext.clearRect(0, 0, composeRef.current.width, composeRef.current.height)
        composeContext.drawImage(
          backgroundCanvas,
          backgroundCanvasX / 2,
          backgroundCanvasY / 2,
          backgroundCanvas.width / globalScale,
          backgroundCanvas.height / globalScale,
        )
      }

      if (shadow1Ref.current && colorYImage && mosaic1Image)
        await drawShadow(shadow1Ref.current, colorYImage, mosaic1Image)

      if (shadow2Ref.current && colorXImage && mosaic2Image)
        await drawShadow(shadow2Ref.current!, colorXImage, mosaic2Image)
    }
  }, [colorXImage, colorYImage, drawShadow, mosaic1Image, mosaic2Image, randomParts])

  useEffect(() => {
    if (randomParts) {
      onComposeDataPropsChange?.({
        background: randomParts.background?.index,
        border: randomParts.border?.index,
        logo: randomParts.logo?.index,
        hat: randomParts.hat?.index,
        accessory: randomParts.accessory?.index,
      })
    }
    render()
  }, [onComposeDataPropsChange, randomParts, render, composeRef.current?.width])

  return (
    <div
      {...props}
      className={twMerge('relative w-full max-w-[340px] overflow-visible', props.className)}
    >
      <Dots className="absolute -z-10 mx-[-60px] my-[-60px] max-w-[550px]" />
      <div className="relative md:mb-[23px]" ref={boxRef}>
        <div
          className="relative aspect-square w-full max-w-[340px]"
          style={{
            transform: `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transitionProperty: 'all',
            transitionDuration: rotateX === 0 ? '200ms' : '0ms',
          }}
        >
          <canvas
            ref={composeRef}
            className="h-full w-full brightness-[93%]"
            width={(composeRef.current?.clientWidth ?? 0) * devicePixelRatio}
            height={(composeRef.current?.clientHeight ?? 0) * devicePixelRatio}
          ></canvas>
          <canvas
            ref={shadow1Ref}
            className="absolute left-0 top-0 h-full w-full mix-blend-screen"
            width={(shadow1Ref.current?.clientWidth ?? 0) * devicePixelRatio}
            height={(shadow1Ref.current?.clientHeight ?? 0) * devicePixelRatio}
          ></canvas>
          <canvas
            ref={shadow2Ref}
            className="absolute left-0 top-0 h-full w-full mix-blend-screen"
            width={(shadow2Ref.current?.clientWidth ?? 0) * devicePixelRatio}
            height={(shadow2Ref.current?.clientHeight ?? 0) * devicePixelRatio}
          ></canvas>
        </div>
        {!isMinted && (
          <div ref={randomRef} className="absolute right-[-15px] top-[10px] cursor-pointer">
            <Random onClick={random} />
          </div>
        )}
        <Share
          onClick={openTwitterShareWindow}
          className="absolute right-[-15px] top-[80px] cursor-pointer md:hidden"
        />
      </div>
      <Button onPress={openTwitterShareWindow} className="mx-auto max-md:hidden" isShadow>
        Share To X
      </Button>
    </div>
  )
}

function UnAuthMint() {
  const { login } = useAuth()
  return (
    <>
      {/* <div className="headline3 p-[200px] text-[40px]">MEMEKING</div> */}
      <div className="mx-auto flex max-w-[1000px] items-center justify-between px-[40px] pt-20 max-md:hidden">
        <div className="relative">
          <Crown className="absolute left-[-80px] top-[-100px] -z-50" />
          <div className="relative">
            <Spatter className="absolute left-[150px] top-[-20px]" />
            {/* <WhoIsMemekingLeft className="mb-[10px]" /> */}
            <h1 className="e1 mb-[10px]">Who Is</h1>
            <h1 className="e3">MEMEKING</h1>
          </div>
          <p className="mb-[30px] capitalize">Memeking CultPad S1: SOL Season Kicks Off!</p>
          <Button isShadow onPress={login} className="mb-[20px] capitalize">
            Crown me, baby!
          </Button>
          <div className="p2 capitalize">Get Your Memeking Token & SBT</div>
        </div>
        <Memeking className="mb-[68px]" />
      </div>
      <div className="flex flex-col items-center px-[40px] pt-[20px] text-center md:hidden">
        <h1 className="e1 mb-[10px]">Who Is</h1>
        <h1 className="e3">MEMEKING</h1>
        <p className="mb-[20px] capitalize">Memeking CultPad S1: SOL Season Kicks Off!</p>
        <Memeking className="mb-[20px]" />
        <Button isShadow className="mb-[20px] capitalize">
          Crown me, baby!
        </Button>
        <div className="p2 mb-[36px] capitalize">Get Your Memeking Token & SBT</div>
      </div>
    </>
  )
}

function AuthedMint() {
  const { publicKey } = useAuth()
  const { showMintCongratulation } = useCongratulationModal()

  const {
    level,
    levelInfo,
    account,
    setEvmAddress,
    status,
    upgradeLevel: _upgradeLevel,
    targetLevelInfo,
    getLatestLevelInfo,
  } = useAccount()

  const [composeDataProps, setComposeDataProps] = useState<ComposeDataProps>()

  const { mint } = useMint()

  const [evm, setEvm] = useState('')
  const { showComing, showSuccess, showMessage, showError } = useModal()
  const { openTwitterShareWindow } = useShareX()

  const { handleError } = useError()

  const confirmEvm = useCallback(async () => {
    if (evm === '') {
      toast.error('Please enter your EVM address.')
      return
    }

    const check = ethers.isAddress(evm)
    if (!check) {
      toast.error('The Ethereum address you provided is invalid. Please enter it again.')
      return
    }

    showMessage({
      title: 'Ethereum address confirmation',
      content: (
        <>
          <div>Do you confirm that your Ethereum wallet address is: {evm}</div>
          <div className="font-semibold">Once bound, it cannot be changed.</div>
        </>
      ),
      onClose: () => null,
      onComfirm: async () => {
        try {
          await setEvmAddress(evm)
          toast.success('Binding successful')
        } catch (error) {
          if (error instanceof ErrorDuplicateEVMAddresses) {
            toast.error('This address has already been used.')
            return
          }

          console.error(error)
        }
      },
    })
  }, [evm, setEvmAddress, showMessage])

  const mintMemeking = useCallback(async () => {
    if (composeDataProps) {
      const close = showComing({
        title: 'Mint MemeKing',
        msg: 'Waiting for Confirmation ..',
      })

      try {
        const result = await mint(composeDataProps)
        if (result?.sbtMetadata) {
          const { info, account } = await getLatestLevelInfo()
          showMintCongratulation({
            title: info?.title ?? '',
            point: account.totalPoints,
          })

          // showSuccess({
          //   title: 'CONGRATULATION',
          //   content: (
          //     <>
          //       <div>You are {info?.title}</div>
          //       <div>{account.totalPoints} Memeking Token Point</div>
          //     </>
          //   ),
          //   footer: <Button onPress={openTwitterShareWindow}>Share to X</Button>,
          // })
        } else {
          showError({
            msg: 'Failed',
          })
        }
      } catch (error) {
        try {
          handleError(error)
        } catch {
          toast.error('Could not submit claim, requested resource not available.')
        }
      } finally {
        close?.()
      }
    }
  }, [
    composeDataProps,
    getLatestLevelInfo,
    handleError,
    mint,
    showComing,
    showError,
    showMintCongratulation,
  ])

  const upgradeLevel = useCallback(async () => {
    const result = await _upgradeLevel()

    if (result?.sbtMetadata && level && result.sbtMetadata.level > level) {
      const { info, account } = await getLatestLevelInfo()

      showSuccess({
        title: 'CONGRATULATION',
        content: (
          <>
            <div>You are {info?.title}</div>
            <div>{account.totalPoints} Memeking Token Point</div>
          </>
        ),
        footer: <Button onPress={openTwitterShareWindow}>Share to X</Button>,
      })
    } else {
      showError({
        msg: 'Failed',
      })
    }
  }, [_upgradeLevel, getLatestLevelInfo, level, openTwitterShareWindow, showError, showSuccess])

  return (
    <>
      <div className="mx-auto flex max-w-[1000px] items-center justify-between px-[40px] pt-20 max-md:hidden">
        <div className="relative">
          <Crown className="absolute left-[-80px] top-[-100px] -z-50" />
          <div className="relative">
            <h1 className="e2 mb-[10px] uppercase">Congratulations</h1>
            <h1 className="mb-[10px] capitalize">
              <span className="e1">you are </span>
              <span className="e3 uppercase">{levelInfo?.title}</span>
            </h1>
          </div>
          {/* <p className="mb-[30px] capitalize">
            Get <span className="h2 text-point">{levelInfo?.point}</span> MemeKing Token Point
          </p> */}
          <p className="mb-[30px] capitalize">
            <span className="h2 text-point">{account?.totalPoints}</span> MemeKing Point
          </p>
          <div className="mb-[20px] flex items-center gap-x-[10px]">
            <Button onPress={mintMemeking} isShadow className="capitalize">
              Mint SBT
            </Button>
            <div className="h3 text-point">/{levelInfo?.cost} SOL</div>
          </div>
          {status === 'not-mint' && (
            <>
              <div className="p2 capitalize">1.Activate Points to Get $MMK Token</div>
              <div className="p2 capitalize">2.Enter the Airdrop List for All Cults</div>
              <div className="p2 mb-[30px] capitalize">3.Share 80% of CultPad Revenue</div>
            </>
          )}
          {status === 'minted' && (
            <>
              <Link href="#tasks">
                <Button className="mb-[20px]" isShadow>
                  Get More MemeKing Point
                </Button>
              </Link>
              <div className="p2 mb-[30px] capitalize">
                Collect more Memeking Points = Memeking Token
              </div>
            </>
          )}
          {status === 'can-upgrade' && (
            <>
              <div className="mb-[20px] flex items-center gap-x-[10px]">
                <Button onPress={upgradeLevel} isShadow className="capitalize">
                  Upgrade To {targetLevelInfo?.title}
                </Button>
                {targetLevelInfo && levelInfo && (
                  <div className="h3 text-point">
                    /{(targetLevelInfo.cost - levelInfo.cost).toFixed(3)} SOL
                  </div>
                )}
              </div>
              <div className="p2 capitalize">1.Collect more Memeking Points = Memeking Token</div>
              <div className="p2 mb-[30px] capitalize">
                2.Upgrading your SBT level boosts airdrop weight
              </div>
            </>
          )}
          <div className="mb-[10px] flex items-center gap-x-[10px]">
            <div className="w-[64px]">Solana</div>
            <Input readOnly className="w-[262px]" defaultValue={publicKey?.toBase58()} />
          </div>
          <div className="flex items-center gap-x-[10px]">
            <div className="w-[64px]">Evm</div>
            {account?.evmAddress === null ? (
              <>
                <Input className="w-[262px]" value={evm} onValueChange={setEvm} />
                {account?.evmAddress === null && <Button onPress={confirmEvm}>confirm</Button>}
              </>
            ) : (
              <Input className="w-[262px]" value={account?.evmAddress} readOnly />
            )}
          </div>
        </div>
        <Memeking onComposeDataPropsChange={setComposeDataProps} />
      </div>
      <div className="flex flex-col items-center px-[40px] pb-12 pt-[20px] text-center md:hidden">
        <h1 className="e2 mb-[10px] uppercase">Congratulations</h1>
        <h1 className="mb-[10px] capitalize">
          <span className="e1">you are </span>
          <span className="e3">{levelInfo?.title}</span>
        </h1>
        {/* <p className="mb-[22px] capitalize">
          Get <span className="h2 text-point">{levelInfo?.point}</span> MemeKing Token Point
        </p> */}
        <p className="mb-[22px] capitalize">
          <span className="h2 text-point">{account?.totalPoints}</span> MemeKing Point
        </p>
        <Memeking onComposeDataPropsChange={setComposeDataProps} />
        <div className="mb-[20px] flex items-center gap-x-[10px]">
          <Button onPress={mintMemeking} isShadow className="capitalize">
            Mint SBT
          </Button>
          <div className="h3 text-point">/{levelInfo?.cost} SOL</div>
        </div>
        {status === 'not-mint' && (
          <>
            <div className="p2 capitalize">1.Activate Points to Get $MMK Token</div>
            <div className="p2 capitalize">2.Enter the Airdrop List for All Cults</div>
            <div className="p2 mb-[30px] capitalize">3.Share 80% of CultPad Revenue</div>
          </>
        )}
        {status === 'minted' && (
          <>
            <Link href="#tasks">
              <Button className="mb-[20px]" isShadow>
                Get More MemeKing Point
              </Button>
            </Link>
            <div className="p2 mb-[30px] capitalize">
              Collect more Memeking Points = Memeking Token
            </div>
          </>
        )}
        {status === 'can-upgrade' && (
          <>
            <div className="mb-[20px] flex items-center gap-x-[10px]">
              <Button onPress={upgradeLevel} isShadow className="capitalize">
                Upgrade To {targetLevelInfo?.title}
              </Button>
              {targetLevelInfo && levelInfo && (
                <div className="h3 text-point">
                  /{(targetLevelInfo.cost - levelInfo.cost).toFixed(3)} SOL
                </div>
              )}
            </div>
            <div className="p2 capitalize">1.Collect more Memeking Points = Memeking Token</div>
            <div className="p2 mb-[30px] capitalize">
              2.Upgrading your SBT level boosts airdrop weight
            </div>
          </>
        )}

        <div className="mb-[10px] flex items-center gap-x-[10px]">
          <div className="w-[64px]">Solana</div>
          <Input readOnly className="w-[262px]" defaultValue={publicKey?.toBase58()} />
        </div>
        <div className="flex items-center gap-x-[10px]">
          <div className="w-[64px]">Evm</div>
          {account?.evmAddress === null ? (
            <>
              <Input className="w-[262px]" value={evm} onValueChange={setEvm} />
              {account?.evmAddress === null && <Button onPress={confirmEvm}>confirm</Button>}
            </>
          ) : (
            <Input className="w-[262px]" value={account?.evmAddress} readOnly />
          )}
        </div>
      </div>
    </>
  )
}

export default function Mint() {
  const { isLogin } = useAuth()

  return (
    <div className="relative overflow-hidden">
      {isLogin ? <AuthedMint /> : <UnAuthMint />}
      <Left className="absolute bottom-0 left-0 -z-20 max-md:hidden" />
      <Right className="absolute bottom-0 right-0 -z-20 max-md:hidden" />
      <div className="mb-[-23px] mt-[-40px] flex justify-center overflow-hidden">
        <Memes className="min-w-[600px] max-w-[1440px]" />
      </div>
    </div>
  )
}
