import * as React from 'react'
import { Box, HStack, Checkbox, Icon } from '@chakra-ui/react'
import type { BoxProps, StackProps, CheckboxProps, IconProps, TextareaProps } from '@chakra-ui/react'
import { HiX } from 'react-icons/hi'
import { BaseTextarea } from '~/src/components/v2/base-textarea'
import type { ExtendsOptionalKeys } from '~/src/types'

export type TTextFieldTaskItem = {
  stackProps?: StackProps
  boxCheckboxProps?: BoxProps
  checkboxProps?: CheckboxProps
  boxTextareaProps?: BoxProps
  textareaProps?: TextareaProps
  boxIconProps?: BoxProps
  iconProps?: IconProps
  onChangeValue: (value: string) => void
}

export type TextFieldTaskItemProps<T> = ExtendsOptionalKeys<
  T,
  {
    'data-testid'?: string
  }
>

export const TextFieldTaskItem = ({
  stackProps,
  boxCheckboxProps,
  checkboxProps = {},
  boxTextareaProps,
  textareaProps = {},
  boxIconProps,
  iconProps,
  onChangeValue,
}: TextFieldTaskItemProps<TTextFieldTaskItem>) => {
  const { onBlur, onKeyPress, ...$textareaProps } = textareaProps
  const { onChange, ...$checkboxProps } = checkboxProps
  const handleSendValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChangeValue) {
      onChangeValue(e.target.value)
    }
  }
  const handleSendValueWithEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onChangeValue && e.key === 'Enter') {
      onChangeValue(e.currentTarget.value)
    }
  }
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e)
    }
  }
  return (
    <HStack
      aria-label='h-stack-component'
      justifyContent={'space-between'}
      alignItems={'center'}
      cursor={'pointer'}
      {...stackProps}
    >
      {/* Notes: Checkbox */}
      <Box
        aria-label='box-checkbox-component'
        h={'12'}
        display='flex'
        justifyContent={'center'}
        alignItems='center'
        pr={'4'}
        {...boxCheckboxProps}
      >
        <Checkbox onChange={handleCheckbox} colorScheme={'twGray'} size={'lg'} {...$checkboxProps} />
      </Box>
      {/* Notes: Input */}
      <Box
        aria-label='box-input-component'
        // Notes: Marginleft is used to remove behave
        style={{ marginLeft: 0 }}
        flexGrow={1}
        minH={'12'}
        display='flex'
        alignItems='center'
        {...boxTextareaProps}
      >
        <BaseTextarea
          textareaProps={{
            variant: 'flushed',
            rows: 1,
            focusBorderColor: 'twGray.400',
            onBlur: handleSendValue,
            onKeyDown: handleSendValueWithEnter,
            ...$textareaProps,
          }}
        />
      </Box>
      {/* Notes: Icon */}
      <Box
        aria-label='box-icon-component'
        // Notes: Marginleft is used to remove behave
        style={{ marginLeft: 0 }}
        h={'12'}
        display='flex'
        justifyContent={'center'}
        alignItems='center'
        pl={'4'}
        {...boxIconProps}
      >
        <Icon as={HiX} w={5} h={5} textColor={'gray.400'} className='hover:text-red-500' {...iconProps} />
      </Box>
    </HStack>
  )
}
