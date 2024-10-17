import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useSnapshot } from 'valtio'
import weighted from 'weighted'

import { getParts } from '@/apis/part'
import { partsStore } from '@/stores/parts'

import useAccount from './use-account'

function partRandom(parts: Part[]) {
  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0)

  return weighted([...parts!, null], [...parts!.map((part) => part.weight), 10000 - totalWeight])
}

export default function usePart() {
  const partsSnapshot = useSnapshot(partsStore)

  const { data: parts } = useSWRImmutable('parts', () => getParts())
  const { account, isMinted, level } = useAccount()

  const backgrounds = useMemo(() => parts?.filter((part) => part.position === 1), [parts])
  const borders = useMemo(() => parts?.filter((part) => part.position === 2), [parts])
  const logos = useMemo(() => parts?.filter((part) => part.position === 3), [parts])
  const hats = useMemo(() => parts?.filter((part) => part.position === 4), [parts])
  // const eyes = useMemo(() => parts?.filter((part) => part.position === 5), [parts])
  // const accessories = useMemo(() => parts?.filter((part) => part.position === 6), [parts])
  const accessories = useMemo(() => parts?.filter((part) => part.position === 5), [parts])

  const random = useCallback(() => {
    if (parts) {
      partsStore.background = partRandom(backgrounds!)

      if (level) {
        if (level === 1) {
          partsStore.border = borders?.find((border) => border.index === 1)!
        } else if (level === 2) {
          partsStore.border = borders?.find((border) => border.index === 2)!
        } else if (level === 3) {
          partsStore.border = borders?.find((border) => border.index === 3)!
        }
      } else {
        partsStore.border = partRandom(borders!)
      }

      partsStore.logo = partRandom(logos!)

      let hat = partRandom(hats!)
      if (hat && (hat.index === 1 || hat.index === 2 || hat.index === 3)) {
        // 如果随机是皇冠的话使其与边框颜色一致
        hat = hats?.find((hat) => hat.index === partsStore.border?.index)!
      }

      partsStore.hat = hat

      partsStore.accessory = partRandom(accessories!)
    }
  }, [accessories, backgrounds, borders, hats, level, logos, parts])

  useEffect(() => {
    if (account && isMinted) {
      partsStore.background = account.composeData.background
      partsStore.border = account.composeData.border
      partsStore.logo = account.composeData.logo
      partsStore.hat = account.composeData.hat
      partsStore.accessory = account.composeData.accessory
    } else if (parts) {
      if (partsStore.background === null) {
        random()
      }
    }
  }, [account, isMinted, parts, random])

  return {
    backgrounds,
    borders,
    logos,
    hats,
    // eyes,
    accessories,
    randomParts: partsSnapshot,
    random,
  }
}
