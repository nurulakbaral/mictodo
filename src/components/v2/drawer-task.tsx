import * as React from 'react'
import { DrawerProps, UseDisclosureProps, Box } from '@chakra-ui/react'
import type { TTaskGroupEntity, TTaskItemEntity } from '~/src/types'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'
import { useApiTaskItem } from '~/src/hooks/use-api-task-item'
import { TextFieldTaskItem } from '~/src/components/v2/ui/text-field-task-item'
import { BaseDrawer } from '~/src/components/v2/ui/base-drawer'
import { BaseTextarea } from '~/src/components/v2/ui/base-textarea'
import { TextFieldAddTask } from '~/src/components/v2/ui/text-field-add-task'

export interface DrawerTaskProps extends Pick<DrawerProps, 'placement'>, UseDisclosureProps {
  taskGroup: TTaskGroupEntity
}

const Component = ({ taskGroup, isOpen = false, onClose = () => {}, placement = 'right' }: DrawerTaskProps) => {
  const { taskGroupMutation } = useApiTaskGroup()
  const { taskItemEntity, taskItemMutation } = useApiTaskItem(taskGroup)

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

  /**
   *
   * Notes: Task Item Cases
   *
   */

  const handleAddTaskItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = e.currentTarget.value
      if (inputValue === '') {
        alert('Please enter a checklistItem')
        return
      }
      if (taskGroup) {
        taskItemMutation.mutate({
          checklist_group_id: taskGroup.id,
          title: inputValue,
          $options: { verb: 'INSERT' },
        })
      }
    }
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
        size: 'lg',
        'data-testid': 'drawer-task',
      }}
      drawerBodyProps={{
        mt: 0,
      }}
      buttonDelete={{
        onClick: handleDeleteTaskGroup,
        'data-testid': 'button-delete-task-group',
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
          taskItemEntity?.data?.data?.map((checklisItem: TTaskItemEntity) => (
            <TextFieldTaskItem
              onChangeValue={handleUpdateTaskItem(checklisItem.id)}
              stackProps={{
                'data-testid': 'task-item-on-drawer-wrapper',
              }}
              key={`item-${checklisItem.id}`}
              iconProps={{
                onClick: () => handleDeleteTaskItem(checklisItem.id),
                'data-testid': 'button-delete-task-item',
              }}
              checkboxProps={{
                onChange: (e) => handleUpdateTaskItemCheckbox(checklisItem.id)(e),
                colorScheme: 'twGray',
                size: 'lg',
                defaultChecked: checklisItem.is_completed,
                'aria-label': 'task-item-checkbox-on-drawer',
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
        <TextFieldAddTask
          boxProps={{
            w: 'full',
            mt: 6,
            'data-testid': 'text-field-add-task-item-wrapper',
          }}
          inputProps={{
            colorScheme: 'white',
            autoComplete: 'off',
            className: 'font-poppins',
            focusBorderColor: 'twGray.400',
            size: 'lg',
            onKeyPress: handleAddTaskItem,
            'data-testid': 'text-field-add-task-item',
          }}
          placeholder='Add Task-Item'
        />
      </Box>
      <Box>
        <BaseTextarea
          withKeyEnter={false}
          textareaProps={{
            'data-testid': 'task-group-description-on-drawer',
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
