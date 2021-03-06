import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  breakpoints: {
    base: '320px',
    sm: '414px',
    md: '576px',
    lg: '768px',
    xl: '1080px',
    '2xl': '1280px',
  },
  colors: {
    twGray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  fonts: {
    heading: 'Cairo, sans-serif',
    body: 'Poppins, sans-serif',
  },
})
