type ComposeDataProps = {
  background?: number
  border?: number
  logo?: number
  hat?: number
  // eyes?: number
  accessory?: number
}

type Part = {
  position: number
  index: number
  level: number
  uinvX: number
  uinvY: number
  image: string
  weight: number
}

type ComposeData = {
  background: Part | null
  border: Part | null
  logo: Part | null
  hat: Part | null
  // eyes: Part | null
  accessory: Part | null
}
