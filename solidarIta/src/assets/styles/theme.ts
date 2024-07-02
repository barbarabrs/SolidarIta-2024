// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 3. extend the theme
export const theme = extendTheme({
  config,
  styles: {
    global: {
      'html, body': {
        height: '100vh',
        color: '#205d8b',
        background: 'white',
      },
      '.color_main': {
        color: '#205d8b',
        background: 'white',
      },
    
    },
  },
  colors: {
    "900": "#182323",
    "800": "#202329",
    "700": "#363646",
    "600": "#4D4D63",
    "500": "#608080",
    "400": "#808099",
    "300": "#9999B0",
    "200": "#B5B5C6",
    "100": "#D2D2DC",
    "50": "#EEF2F2",
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Poppins, sans-serif',
  },
  components: {
    MultiSelect: {
      control: {
        borderColor: 'black'
      }
    }
  }
})

