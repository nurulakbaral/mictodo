import * as React from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export interface LayoutContainerProps extends BoxProps {}

export const LayoutContainer = (props: LayoutContainerProps) => {
  return (
    <Box bgColor={'white'} minHeight={'100vh'} maxWidth={'xl'} mx={'auto'} {...props}>
      {props.children}
    </Box>
  )
}
