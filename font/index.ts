import { DynaPuff } from 'next/font/google'
import localFont from 'next/font/local'

export const DynaPuffFont = DynaPuff({ subsets: ['latin'], weight: ['400', '600', '700'] })

// export const WhocatsFont = localFont({ src: 'fonts/whocats.otf', variable: '--font-whocats' })
export const SupercellMagicFont = localFont({
  src: 'fonts/supercell-magic.ttf',
  variable: '--font-supercell-magic',
})
