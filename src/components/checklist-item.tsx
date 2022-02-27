import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { Box, BoxProps, Text, TextProps, Checkbox, CheckboxProps } from '@chakra-ui/react'

type InputChecklistProps = BaseProps<
  {
    value: string
    CheckboxPros: CheckboxProps
    TextProps: TextProps
  },
  'div'
> &
  BoxProps

export const ChecklistItem = ({
  className,
  value = 'Baca buku 10 menit',
  onClick,
  CheckboxPros: { onChange, ...CheckboxProps },
  TextProps = { className: 'font-poppins cursor-default', fontSize: 'lg' },
  ...props
}: InputChecklistProps) => {
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🪲 - e.target.checked', e.target.checked)
  }
  return (
    <Box className={`w-5/6 mx-auto h-12 flex items-center border-[1px] rounded-md ${className}`} {...props}>
      <Box h='full' rounded={'md'} className='flex items-center' mb={0.2}>
        <Checkbox onChange={handleCheckbox} {...CheckboxProps} />
      </Box>
      <Box h='full' w='full' rounded={'md'} className='flex items-center' onClick={onClick}>
        <Text {...TextProps}>{value}</Text>
      </Box>
    </Box>
  )
}
