import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { InputProps, Input, Checkbox, CheckboxProps } from '@chakra-ui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import type { TChecklistGroupEntity, TChecklistItemEntity } from '~/src/types'
import { PostgrestResponse } from '@supabase/supabase-js'
import { supabaseClient } from '~/src/libs/supabase-client'
import { useMutation, useQueryClient } from 'react-query'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'

type InputChecklistProps = BaseProps<
  {
    ariaLabel: 'group' | 'item'
    checklistItemId: string
    checklisGroupEntity: TChecklistGroupEntity
    InputProps: InputProps
    CheckboxPros: CheckboxProps
    isCloseIcon?: boolean
    onClose?: () => void
    queryInputValue?: (value: string) => void
    dataTestId: string
  },
  'div'
>

const updateChecklistItem = async ({
  id,
  is_completed,
}: Partial<Pick<TChecklistItemEntity, 'id' | 'is_completed'>>) => {
  const response = await supabaseClient
    .from<TChecklistItemEntity>('$DB_checklist_item')
    .update({ is_completed })
    .match({ id })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}

export const InputChecklist = ({
  ariaLabel,
  checklistItemId,
  checklisGroupEntity,
  className,
  isCloseIcon = false,
  onClose,
  queryInputValue,
  InputProps: { onChange, value = '', onBlur, defaultValue, onKeyPress, ...InputProps },
  CheckboxPros: { onChange: $checkboxOnChange, ...CheckboxProps },
  dataTestId,
  ...props
}: InputChecklistProps) => {
  const queryClient = useQueryClient()
  const { taskGroupMutation } = useApiTaskGroup()
  const { mutate } = useMutation(updateChecklistItem, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistItemEntity>) => {
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistItem', checklisGroupEntity.id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistItemEntity> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        const updateOldData = (old: TChecklistItemEntity) => (old.id === freshData.id ? freshData : old)
        return {
          ...$oldQueryData,
          data: oldData.map(updateOldData),
        }
      })
    },
  })
  const [inputValue, setInputValue] = React.useState('')
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    ariaLabel === 'item'
      ? mutate({ id: checklistItemId, is_completed: isChecked })
      : taskGroupMutation.mutate({ id: checklistItemId, is_completed: isChecked, verb: 'UPDATE' })
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
