import * as React from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export interface LayoutProps extends BoxProps {}

export const Layout = (props: LayoutProps) => {
  return (
    <Box bgColor={'white'} minHeight={'100vh'} aria-label={'layout'} data-testid='layout' {...props}>
      {props.children}
    </Box>
  )
}
