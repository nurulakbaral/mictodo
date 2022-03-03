import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { Box, BoxProps, Text, TextProps, Checkbox, CheckboxProps } from '@chakra-ui/react'
import type { TChecklistGroupEntity } from '~/src/types'
import { useMutation, useQueryClient } from 'react-query'
import { PostgrestResponse } from '@supabase/supabase-js'
import { supabaseClient } from '~/src/libs/supabase-client'

type InputChecklistProps = BaseProps<
  {
    checklisGroupEntity: TChecklistGroupEntity
    CheckboxPros: CheckboxProps
    TextProps: TextProps
  },
  'div'
> &
  BoxProps

const updateChecklistGroup = async ({
  id,
  is_completed,
}: Partial<Pick<TChecklistGroupEntity, 'id' | 'is_completed'>>) => {
  const response = await supabaseClient
    .from<TChecklistGroupEntity>('$DB_checklist_group')
    .update({ is_completed })
    .match({ id })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}

export const ChecklistItem = ({
  className,
  onClick,
  checklisGroupEntity,
  CheckboxPros: { onChange, ...CheckboxProps },
  TextProps = { className: 'font-poppins cursor-default', fontSize: 'lg' },
  ...props
}: InputChecklistProps) => {
  const queryClient = useQueryClient()
  const { mutate } = useMutation(updateChecklistGroup, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistGroupEntity>) => {
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistGroup', checklisGroupEntity.user_id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistGroupEntity> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        const updateOldData = (old: TChecklistGroupEntity) => (old.id === freshData.id ? freshData : old)
        return {
          ...$oldQueryData,
          data: oldData.map(updateOldData),
        }
      })
    },
  })
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    mutate({ id: checklisGroupEntity.id, is_completed: isChecked })
  }
  return (
    <Box
      data-testid='checklist-group-unit'
      className={`w-5/6 mx-auto h-12 flex items-center border-[1px] rounded-md ${className}`}
      {...props}
    >
      <Box h='full' rounded={'md'} className='flex items-center' mb={0.2}>
        <Checkbox aria-label='checklist-group-checkbox' onChange={handleCheckbox} {...CheckboxProps} />
      </Box>
      <Box h='full' w='full' rounded={'md'} className='flex items-center' onClick={onClick}>
        <Text {...TextProps}>{checklisGroupEntity.title}</Text>
      </Box>
    </Box>
  )
}
