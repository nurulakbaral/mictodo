import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { InputProps, Input, Checkbox, CheckboxProps } from '@chakra-ui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import type { TTaskGroupEntity, TTaskItemEntity } from '~/src/types'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'
import { useApiTaskItem } from '~/src/hooks/use-api-task-item'

type InputChecklistProps = BaseProps<
  {
    ariaLabel: 'group' | 'item'
    checklistItemId: string
    taskGroup: TTaskGroupEntity
    InputProps: InputProps
    CheckboxPros: CheckboxProps
    isCloseIcon?: boolean
    onClose?: () => void
    queryInputValue?: (value: string) => void
    dataTestId: string
  },
  'div'
>

export const InputChecklist = ({
  ariaLabel,
  checklistItemId,
  taskGroup,
  className,
  isCloseIcon = false,
  onClose,
  queryInputValue,
  InputProps: { onChange, value = '', onBlur, defaultValue, onKeyPress, ...InputProps },
  CheckboxPros: { onChange: $checkboxOnChange, ...CheckboxProps },
  dataTestId,
  ...props
}: InputChecklistProps) => {
  const { taskGroupMutation } = useApiTaskGroup()
  const { taskItemMutation } = useApiTaskItem(taskGroup)
  const [inputValue, setInputValue] = React.useState('')
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    ariaLabel === 'item'
      ? taskItemMutation.mutate({ id: checklistItemId, is_completed: isChecked, $options: { verb: 'UPDATE' } })
      : taskGroupMutation.mutate({ id: checklistItemId, is_completed: isChecked, $options: { verb: 'UPDATE' } })
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handleSendData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (queryInputValue) {
      queryInputValue(value)
    }
  }
  const handleSendDataWithEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (queryInputValue && e.key === 'Enter') {
      queryInputValue(value)
    }
  }
  React.useEffect(() => {
    setInputValue(value as string)
  }, [value])
  return (
    <div data-testid={dataTestId} className={`w-full h-12 flex items-center relative ${className}`} {...props}>
      <div className='absolute z-10 mx-4 mt-1'>
        <Checkbox
          onChange={handleCheckbox}
          aria-label={`checklist-${ariaLabel}-checkbox-on-drawer`}
          {...CheckboxProps}
        />
      </div>
      <Input
        onBlur={handleSendData}
        onKeyPress={handleSendDataWithEnter}
        onChange={handleInput}
        value={inputValue}
        {...InputProps}
      />
      {isCloseIcon && (
        <div className='absolute z-10 mx-4 right-0'>
          <XCircleIcon
            data-testid='btn-remove-checklist-item'
            onClick={onClose}
            className='h-4 w-4 text-gray-400 cursor-pointer hover:text-red-600'
          />
        </div>
      )}
    </div>
  )
}
