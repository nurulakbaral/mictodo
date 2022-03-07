import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { Box, BoxProps, Text, TextProps, Checkbox, CheckboxProps } from '@chakra-ui/react'
import type { TChecklistGroupEntity } from '~/src/types'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'

type InputChecklistProps = BaseProps<
  {
    checklisGroupEntity: TChecklistGroupEntity
    CheckboxPros: CheckboxProps
    TextProps: TextProps
  },
  'div'
> &
  BoxProps

export const ChecklistItem = ({
  className,
  onClick,
  checklisGroupEntity,
  CheckboxPros: { onChange, ...CheckboxProps },
  TextProps = { className: 'font-poppins cursor-default', fontSize: 'lg' },
  ...props
}: InputChecklistProps) => {
  const { taskGroupMutation } = useApiTaskGroup()
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    taskGroupMutation.mutate({ id: checklisGroupEntity.id, is_completed: isChecked, verb: 'UPDATE' })
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
