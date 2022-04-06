import * as React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Box,
  Divider,
  Flex,
  Text,
  Icon,
} from '@chakra-ui/react'
import { HiOutlineTrash } from 'react-icons/hi'
import type {
  DrawerProps,
  ModalOverlayProps,
  DrawerContentProps,
  CloseButtonProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ButtonProps,
} from '@chakra-ui/react'
import { ExtendsOptionalKeys } from '~/src/types'

type TBaseDrawer = {
  children: React.ReactNode
  rootDrawerProps: Omit<DrawerProps, 'children'>
  drawerOverlayProps?: ModalOverlayProps
  drawerContentProps?: DrawerContentProps
  drawerCloseButtonProps?: CloseButtonProps
  drawerHeaderProps?: ModalHeaderProps
  drawerBodyProps?: ModalBodyProps
  drawerFooterProps?: ModalFooterProps
  buttonDelete?: ButtonProps
}
type BaseDrawerProps = ExtendsOptionalKeys<
  TBaseDrawer,
  {
    'data-testid'?: string
  }
>

export const BaseDrawer = ({
  children,
  rootDrawerProps,
  drawerOverlayProps,
  drawerContentProps,
  drawerCloseButtonProps,
  drawerHeaderProps,
  drawerBodyProps,
  drawerFooterProps,
  buttonDelete,
}: BaseDrawerProps) => {
  return (
    <Drawer placement='right' size='sm' {...rootDrawerProps}>
      <DrawerOverlay {...drawerOverlayProps} />
      <DrawerContent {...drawerContentProps}>
        {/* Notes: Button Close */}
        <DrawerCloseButton className='text-gray-400' {...drawerCloseButtonProps} />
        {/* Notes: Header */}
        <DrawerHeader mt={12} {...drawerHeaderProps}>
          <Divider />
        </DrawerHeader>
        {/* Notes: Body */}
        <DrawerBody mt={6} {...drawerBodyProps}>
          {children}
        </DrawerBody>
        {/* Notes: Footer */}
        <Divider />
        <DrawerFooter {...drawerFooterProps}>
          <Flex justifyContent={'space-between'} alignItems={'center'} w='full'>
            <Box>
              <Text className='text-gray-500' fontSize={'md'}>
                Have a nice day!
              </Text>
            </Box>
            <Box>
              <Button colorScheme={'white'} {...buttonDelete}>
                <Icon as={HiOutlineTrash} w={6} h={6} boxSize={'1.6em'} textColor={'gray.400'} />
              </Button>
            </Box>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
