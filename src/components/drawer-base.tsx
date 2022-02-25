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

type DrawerBaseProps = { cheklistGroupTitle: string } & Pick<DrawerProps, 'placement'> & UseDisclosureProps
type FormValues = {
  childTask: string
}

export const DrawerBase = ({
  cheklistGroupTitle,
  isOpen = false,
  onClose = () => {},
  placement = 'right',
}: DrawerBaseProps) => {
  const { register, handleSubmit: onSubmit, watch, reset } = useForm<FormValues>()
  const [childTask, setChildTask] = React.useState<Array<string>>([''])
  const taskValue = watch('childTask')
  const handleSubmit = (values: FormValues) => {
    if (values.childTask === '') {
      alert('Please enter a childTask')
      return
    }
    setChildTask((prevState) => [...prevState, values.childTask])
    reset({
      childTask: '',
    })
  }
  const handleDeleteChildTask = (index: number) => {
    const newState = [...childTask]
    newState.splice(index, 1)
    setChildTask(newState)
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
                value: cheklistGroupTitle,
              }}
            />
          </Box>
          {/* Childs */}
          <Box mb={6}>
            {childTask.map((item, index) =>
              !item ? null : (
                <InputChecklist
                  key={`item-${index}`}
                  isCloseIcon={true}
                  onClose={() => handleDeleteChildTask(index)}
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
                    value: item,
                  }}
                />
              ),
            )}
            <form className='mx-auto mt-1' onSubmit={onSubmit(handleSubmit)}>
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
                  ...register('childTask'),
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
