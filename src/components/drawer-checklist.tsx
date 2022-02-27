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
import { addChecklistItem, deleteChecklistItem } from '~/src/store/features/checklist-item'
import type { TChecklistGroupDB } from '~/src/types'

type DrawerChecklistProps = { checklistGroup: TChecklistGroupDB | null | undefined } & Pick<DrawerProps, 'placement'> &
  UseDisclosureProps
type FormValues = {
  checklistItem: string
}

export const DrawerChecklist = ({
  checklistGroup,
  isOpen = false,
  onClose = () => {},
  placement = 'right',
}: DrawerChecklistProps) => {
  const checklistItem = useAppSelector((state) => state.checklistItem.checklistItemData)
  const dispatch = useAppDispatch()
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const taskValue = watch('checklistItem')
  const handleAddChecklistItem = (values: FormValues) => {
    if (values.checklistItem === '') {
      alert('Please enter a checklistItem')
      return
    }
    // Notes: Add state (checklist item) to store
    if (checklistGroup) {
      dispatch(addChecklistItem({ checklistGroupId: checklistGroup.id, value: values.checklistItem }))
    }
    reset({
      checklistItem: '',
    })
  }
  const handleDeleteChecklistItem = (checklisItemId: string) => {
    if (checklistGroup) {
      dispatch(deleteChecklistItem({ id: checklisItemId, checklistGroupId: checklistGroup.id }))
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
                value: checklistGroup?.title,
              }}
            />
          </Box>
          {/* Childs */}
          <Box mb={6}>
            {checklistGroup &&
              checklistItem[checklistGroup.id]?.map(({ id, value }) => (
                <InputChecklist
                  key={`item-${id}`}
                  isCloseIcon={true}
                  onClose={() => handleDeleteChecklistItem(id)}
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
            <form className='mx-auto mt-1' onSubmit={handleSubmit(handleAddChecklistItem)}>
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
                  ...register('checklistItem'),
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
