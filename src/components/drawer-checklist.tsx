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
import type { TChecklistGroupEntity, TChecklistItemEntity } from '~/src/types'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'
import { useApiTaskItem } from '~/src/hooks/use-api-task-item'

type DrawerChecklistProps = { taskGroup: TChecklistGroupEntity } & Pick<DrawerProps, 'placement'> & UseDisclosureProps
type FormValues = {
  checklistItem: string
}

const Component = ({ taskGroup, isOpen = false, onClose = () => {}, placement = 'right' }: DrawerChecklistProps) => {
  const { taskGroupMutation } = useApiTaskGroup()
  const { taskItemEntity, taskItemMutation } = useApiTaskItem(taskGroup)
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const taskValue = watch('checklistItem')
  // Notes: Task Group Cases
  const handleUpdateTaskGroup = (title: string) => taskGroupMutation.mutate({ id: taskGroup.id, title, verb: 'UPDATE' })
  const handleDeleteTaskGroup = () => {
    taskGroupMutation.mutate({ id: taskGroup.id, verb: 'DELETE' })
    onClose()
  }
  const handleUpdateTaskGroupDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value
    taskGroupMutation.mutate({ id: taskGroup.id, description, verb: 'UPDATE' })
  }
  const handleUpdateTaskGroupDescWithEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const description = e.currentTarget.value
    if (e.key === 'Enter') {
      taskGroupMutation.mutate({ id: taskGroup.id, description, verb: 'UPDATE' })
    }
  }
  // Notes: Task Item Cases
  const handleAddTaskItem = async (values: FormValues) => {
    if (values.checklistItem === '') {
      alert('Please enter a checklistItem')
      return
    }
    if (taskGroup) {
      taskItemMutation.mutate({ checklist_group_id: taskGroup.id, title: values.checklistItem, verb: 'INSERT' })
    }
    reset({
      checklistItem: '',
    })
  }
  const handleDeleteTaskItem = (checklisItemId: string) => {
    taskItemMutation.mutate({ id: checklisItemId, verb: 'DELETE' })
  }
  const handleUpdateTaskItem = (id: string) => {
    return (title: string) => {
      taskItemMutation.mutate({ id, title, verb: 'UPDATE' })
    }
  }
  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <Box>
          <DrawerCloseButton className='text-gray-400' />
        </Box>
        <DrawerHeader mt={12} mb={0}>
          <Divider />
        </DrawerHeader>
        <DrawerBody>
          <Box mb={6}>
            {/* Parent */}
            <InputChecklist
              dataTestId='checklist-group-unit-on-drawer'
              ariaLabel='group'
              checklistItemId={taskGroup.id}
              taskGroup={taskGroup}
              queryInputValue={handleUpdateTaskGroup}
              CheckboxPros={{
                colorScheme: 'twGray',
                size: 'lg',
                defaultChecked: taskGroup.is_completed,
              }}
              InputProps={{
                colorScheme: 'white',
                autoComplete: 'off',
                className: 'font-poppins',
                focusBorderColor: 'twGray.300',
                pl: '12',
                size: 'lg',
                value: taskGroup.title,
              }}
            />
          </Box>
          {/* Childs */}
          <Box mb={6}>
            {taskGroup &&
              taskItemEntity?.data?.data?.map((checklisItem: TChecklistItemEntity) => (
                <InputChecklist
                  dataTestId='checklist-item-unit-on-drawer'
                  ariaLabel='item'
                  checklistItemId={checklisItem.id}
                  taskGroup={taskGroup}
                  queryInputValue={handleUpdateTaskItem(checklisItem.id)}
                  key={`item-${checklisItem.id}`}
                  isCloseIcon={true}
                  onClose={() => handleDeleteTaskItem(checklisItem.id)}
                  CheckboxPros={{
                    colorScheme: 'twGray',
                    size: 'lg',
                    isChecked: checklisItem.is_completed,
                  }}
                  InputProps={{
                    colorScheme: 'white',
                    autoComplete: 'off',
                    className: 'font-poppins',
                    focusBorderColor: 'twGray.300',
                    pl: '12',
                    size: 'md',
                    value: checklisItem.title,
                  }}
                />
              ))}
            <form data-testid='checklist-item-form' className='mx-auto mt-1' onSubmit={handleSubmit(handleAddTaskItem)}>
              <InputTask
                variant='Add Item-Task'
                className='w-full'
                value={taskValue}
                dataTestId='checklist-item-input'
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
            <Textarea
              data-testid='checklist-group-description-on-drawer'
              onKeyPress={handleUpdateTaskGroupDescWithEnter}
              onBlur={handleUpdateTaskGroupDesc}
              defaultValue={taskGroup.description}
              resize={'none'}
              placeholder='Add note'
            />
          </Box>
        </DrawerBody>
        <Divider />
        <DrawerFooter>
          <Flex justifyContent={'space-between'} alignItems={'center'} w='full'>
            <Box>
              <Text className='text-gray-500' fontSize={'md'}>
                Have a nice day!
              </Text>
            </Box>
            <Box>
              <Button data-testid='btn-remove-checklist-group-unit' colorScheme='white' onClick={handleDeleteTaskGroup}>
                <TrashIcon className='w-6 h-6 text-gray-400' />
              </Button>
            </Box>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const DrawerChecklist = React.memo(Component)
DrawerChecklist.displayName = 'DrawerChecklist'
