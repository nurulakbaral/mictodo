import * as React from 'react'
import {
  Drawer,
  DrawerProps,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  UseDisclosureProps,
  Box,
} from '@chakra-ui/react'

type DrawerBaseProps = { cheklistGroupTitle: string } & Pick<DrawerProps, 'placement'> & UseDisclosureProps

export const DrawerBase = ({
  cheklistGroupTitle,
  isOpen = false,
  onClose = () => {},
  placement = 'right',
}: DrawerBaseProps) => {
  console.log('🪲 - cheklistGroupTitle', cheklistGroupTitle)
  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <Box mb={8}>
          <DrawerCloseButton className='text-gray-400' />
        </Box>
        <DrawerHeader>{cheklistGroupTitle}</DrawerHeader>
        <DrawerBody>
          <Input placeholder='Type here...' />
        </DrawerBody>
        <DrawerFooter>
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='blue'>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
