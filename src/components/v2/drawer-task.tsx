import * as React from 'react'
import { DrawerProps, UseDisclosureProps, Box } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import type { TChecklistGroupEntity, TChecklistItemEntity } from '~/src/types'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'
import { useApiTaskItem } from '~/src/hooks/use-api-task-item'
import { TextFieldTaskItem } from '~/src/components/v2/text-field-task-item'
import { BaseDrawer } from '~/src/components/v2/base-drawer'
import { BaseTextarea } from '~/src/components/v2/base-textarea'

type DrawerTaskProps = { taskGroup: TChecklistGroupEntity } & Pick<DrawerProps, 'placement'> & UseDisclosureProps
type FormValues = {
  checklistItem: string
}

const Component = ({ taskGroup, isOpen = false, onClose = () => {}, placement = 'right' }: DrawerTaskProps) => {
  const { taskGroupMutation } = useApiTaskGroup()
  const { taskItemEntity, taskItemMutation } = useApiTaskItem(taskGroup)
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const taskValue = watch('checklistItem')

  /**
   *
   * Notes: Task Group Cases
   *
   */

  const handleUpdateTaskGroup = (value: string) => {
    taskGroupMutation.mutate({ id: taskGroup.id, title: value, $options: { verb: 'UPDATE' } })
  }
  const handleUpdateTaskGroupCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    taskGroupMutation.mutate({ id: taskGroup.id, is_completed: e.currentTarget.checked, $options: { verb: 'UPDATE' } })
  }
  const handleDeleteTaskGroup = () => {
    taskGroupMutation.mutate({
      id: taskGroup.id,
      $options: {
        verb: 'DELETE',
        alertInfo: {
          onError: {
            title: 'Failed to delete Task-Group!',
            description: 'Delete the Task-Item, then try again to delete the Task-Group.',
          },
        },
      },
    })
    onClose()
  }
  const handleUpdateTaskGroupDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value
    taskGroupMutation.mutate({ id: taskGroup.id, description, $options: { verb: 'UPDATE' } })
  }
  const handleUpdateTaskGroupDescWithEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const description = e.currentTarget.value
    if (e.key === 'Enter') {
      taskGroupMutation.mutate({ id: taskGroup.id, description, $options: { verb: 'UPDATE' } })
    }
  }

  /**
   *
   * Notes: Task Item Cases
   *
   */

  const handleAddTaskItem = async (values: FormValues) => {
    if (values.checklistItem === '') {
      alert('Please enter a checklistItem')
      return
    }
    if (taskGroup) {
      taskItemMutation.mutate({
        checklist_group_id: taskGroup.id,
        title: values.checklistItem,
        $options: { verb: 'INSERT' },
      })
    }
    reset({
      checklistItem: '',
    })
  }
  const handleDeleteTaskItem = (checklisItemId: string) => {
    taskItemMutation.mutate({ id: checklisItemId, $options: { verb: 'DELETE' } })
  }
  const handleUpdateTaskItem = (id: string) => {
    return (title: string) => {
      taskItemMutation.mutate({ id, title, $options: { verb: 'UPDATE' } })
    }
  }
  const handleUpdateTaskItemCheckbox = (id: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      taskItemMutation.mutate({
        id,
        is_completed: e.currentTarget.checked,
        $options: { verb: 'UPDATE' },
      })
    }
  }

  return (
    <BaseDrawer
      rootDrawerProps={{
        isOpen,
        onClose,
        placement,
        size: 'sm',
      }}
      drawerBodyProps={{
        mt: 0,
      }}
      buttonDelete={{
        onClick: handleDeleteTaskGroup,
      }}
    >
      <Box mb={4}>
        {/* Task Group */}
        <TextFieldTaskItem
          onChangeValue={handleUpdateTaskGroup}
          stackProps={{
            'data-testid': 'checklist-group-unit-on-drawer',
            'aria-label': 'task-group',
          }}
          textareaProps={{
            variant: 'flushed',
            colorScheme: 'white',
            autoComplete: 'off',
            className: 'font-poppins',
            focusBorderColor: 'twGray.300',
            size: 'lg',
            fontWeight: 'semibold',
            defaultValue: taskGroup.title,
          }}
          boxIconProps={{
            display: 'none',
          }}
          checkboxProps={{
            onChange: handleUpdateTaskGroupCheckbox,
            colorScheme: 'twGray',
            size: 'lg',
            defaultChecked: taskGroup.is_completed,
          }}
        />
      </Box>
      {/* Task Item */}
      <Box mb={6}>
        {taskGroup &&
          taskItemEntity?.data?.data?.map((checklisItem: TChecklistItemEntity) => (
            <TextFieldTaskItem
              onChangeValue={handleUpdateTaskItem(checklisItem.id)}
              stackProps={{
                'data-testid': 'checklist-item-unit-on-drawer',
                'aria-label': 'task-group',
              }}
              key={`item-${checklisItem.id}`}
              iconProps={{
                onClick: () => handleDeleteTaskItem(checklisItem.id),
              }}
              checkboxProps={{
                onChange: (e) => handleUpdateTaskItemCheckbox(checklisItem.id)(e),
                colorScheme: 'twGray',
                size: 'lg',
                defaultChecked: checklisItem.is_completed,
              }}
              textareaProps={{
                colorScheme: 'white',
                autoComplete: 'off',
                className: 'font-poppins',
                focusBorderColor: 'twGray.300',
                size: 'md',
                defaultValue: checklisItem.title,
              }}
            />
          ))}
        <form data-testid='checklist-item-form' className='mx-auto mt-4' onSubmit={handleSubmit(handleAddTaskItem)}>
          <InputTask
            variant='Add Task-Item'
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
        <BaseTextarea
          textareaProps={{
            'data-testid': 'checklist-group-description-on-drawer',
            onKeyPress: handleUpdateTaskGroupDescWithEnter,
            onBlur: handleUpdateTaskGroupDesc,
            defaultValue: taskGroup.description,
            placeholder: 'Add note',
          }}
        />
      </Box>
    </BaseDrawer>
  )
}

export const DrawerTask = React.memo(Component)
DrawerTask.displayName = 'DrawerTask'
