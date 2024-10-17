import { nextui } from '@nextui-org/theme'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './provides/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'supercell-magic': ['var(--font-supercell-magic)'],
      },
      colors: {
        background: '#FFEFD4',
        brand: '#FFB433',
        main: '#563B00',
        primary: '#FFEA05',
        point: '#FF8000',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
}
export default config
