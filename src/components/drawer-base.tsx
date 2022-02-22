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
  UseDisclosureProps,
  Box,
} from '@chakra-ui/react'
import { InputChecklist } from '~/src/components/input-checklist'

type DrawerBaseProps = { cheklistGroupTitle: string } & Pick<DrawerProps, 'placement'> & UseDisclosureProps

export const DrawerBase = ({
  cheklistGroupTitle,
  isOpen = false,
  onClose = () => {},
  placement = 'right',
}: DrawerBaseProps) => {
  console.log('🪲 - cheklistGroupTitle', cheklistGroupTitle)
  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <Box mb={8}>
          <DrawerCloseButton className='text-gray-400' />
        </Box>
        <DrawerHeader>Your Task</DrawerHeader>
        <DrawerBody>
          {/* Parent */}
          <InputChecklist
            className='mb-6'
            CheckboxPros={{
              colorScheme: 'twGray',
              size: 'lg',
            }}
            InputProps={{
              colorScheme: 'white',
              autoComplete: 'off',
              className: 'font-poppins',
              focusBorderColor: 'twGray.300',
              pl: '12',
              size: 'lg',
              defaultValue: cheklistGroupTitle,
            }}
          />
          {/* Childs */}
          <InputChecklist
            CheckboxPros={{
              colorScheme: 'twGray',
              size: 'lg',
            }}
            InputProps={{
              colorScheme: 'white',
              autoComplete: 'off',
              className: 'font-poppins',
              focusBorderColor: 'twGray.300',
              pl: '12',
              size: 'md',
              defaultValue: 'Child Task',
            }}
          />
          <InputChecklist
            CheckboxPros={{
              colorScheme: 'twGray',
              size: 'lg',
            }}
            InputProps={{
              colorScheme: 'white',
              autoComplete: 'off',
              className: 'font-poppins',
              focusBorderColor: 'twGray.300',
              pl: '12',
              size: 'md',
              defaultValue: 'Child Tasker',
            }}
          />
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
