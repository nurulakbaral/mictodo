import * as React from 'react'
import {
  Divider,
  Drawer,
  DrawerProps,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Button,
  UseDisclosureProps,
  Box,
  Flex,
  Textarea,
} from '@chakra-ui/react'
import { InputChecklist } from '~/src/components/input-checklist'
import { TrashIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import { useAppDispatch, useAppSelector } from '~/src/hooks/useRedux'
import type { TCheklistGroup } from '~/src/store/features/cheklist-group'
import { addCheklistItem, deleteCheklistItem } from '~/src/store/features/cheklist-item'

type DrawerCheklistProps = { cheklistGroup: TCheklistGroup | null | undefined } & Pick<DrawerProps, 'placement'> &
  UseDisclosureProps
type FormValues = {
  cheklistItem: string
}

export const DrawerCheklist = ({
  cheklistGroup,
  isOpen = false,
  onClose = () => {},
  placement = 'right',
}: DrawerCheklistProps) => {
  const checklistItem = useAppSelector((state) => state.cheklistItem.cheklistItemData)
  const dispatch = useAppDispatch()
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const taskValue = watch('cheklistItem')
  const handleAddCheklistItem = (values: FormValues) => {
    if (values.cheklistItem === '') {
      alert('Please enter a cheklistItem')
      return
    }
    // Notes: Add state (cheklist item) to store
    if (cheklistGroup) {
      dispatch(addCheklistItem({ cheklistGroupId: cheklistGroup.id, value: values.cheklistItem }))
    }
    reset({
      cheklistItem: '',
    })
  }
  const handleDeleteCheklistItem = (cheklisItemId: string) => {
    if (cheklistGroup) {
      dispatch(deleteCheklistItem({ id: cheklisItemId, cheklistGroupId: cheklistGroup.id }))
    }
  }
  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <Box mb={8}>
          <DrawerCloseButton className='text-gray-400' />
        </Box>
        <DrawerHeader>Your Task</DrawerHeader>
        <DrawerBody>
          <Box mb={6}>
            {/* Parent */}
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
                size: 'lg',
                value: cheklistGroup?.value,
              }}
            />
          </Box>
          {/* Childs */}
          <Box mb={6}>
            {cheklistGroup &&
              checklistItem[cheklistGroup.id]?.map(({ id, value }) => (
                <InputChecklist
                  key={`item-${id}`}
                  isCloseIcon={true}
                  onClose={() => handleDeleteCheklistItem(id)}
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
                    value: value,
                  }}
                />
              ))}
            <form className='mx-auto mt-1' onSubmit={handleSubmit(handleAddCheklistItem)}>
              <InputTask
                className='w-full'
                value={taskValue}
                InputProps={{
                  colorScheme: 'white',
                  autoComplete: 'off',
                  className: 'font-poppins',
                  focusBorderColor: 'twGray.400',
                  size: 'lg',
                  w: 'full',
                  ...register('cheklistItem'),
                }}
              />
            </form>
          </Box>
          <Box>
            <Textarea resize={'none'} placeholder='Add note' />
          </Box>
        </DrawerBody>
        <Divider />
        <DrawerFooter>
          <Flex justifyContent={'space-between'} alignItems={'center'} w='full'>
            <Box>
              <Text className='text-gray-500' fontSize={'md'}>
                Created 3 hours ago
              </Text>
            </Box>
            <Box>
              <Button colorScheme='white'>
                <TrashIcon className='w-6 h-6 text-gray-400' />
              </Button>
            </Box>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
