import * as React from 'react'
import { Box, Checkbox, Text, HStack, Icon } from '@chakra-ui/react'
import { HiOutlineStar, HiStar } from 'react-icons/hi'
import type { StackProps, BoxProps, CheckboxProps, TextProps, IconProps } from '@chakra-ui/react'
import type { ExtendsOptionalKeys } from '~/src/types'

type TTextFieldTaskGroup = {
  stackProps?: StackProps
  boxCheckboxProps?: BoxProps
  checkboxProps?: CheckboxProps
  boxFieldProps?: BoxProps
  textFieldProps?: TextProps
  boxIconProps?: BoxProps
  iconProps?: IconProps
  isPriority: boolean
  children: React.ReactNode
}
type TextFieldTaskGroupProps = ExtendsOptionalKeys<
  TTextFieldTaskGroup,
  {
    'data-testid'?: string
  }
>

export const TextFieldTaskGroup = ({
  stackProps,
  boxCheckboxProps,
  checkboxProps,
  boxFieldProps,
  textFieldProps,
  boxIconProps,
  iconProps,
  isPriority = false,
  children,
}: TextFieldTaskGroupProps) => {
  return (
    <HStack
      aria-label='h-stack-component'
      mx={'4'}
      justifyContent={'space-between'}
      alignItems={'center'}
      cursor={'pointer'}
      borderRadius={'sm'}
      border={'1px solid'}
      borderColor={'gray.200'}
      {...stackProps}
    >
      {/* Notes: Checkbox */}
      <Box
        aria-label='box-checkbox-component'
        h={'12'}
        display='flex'
        justifyContent={'center'}
        alignItems='center'
        px={'4'}
        {...boxCheckboxProps}
      >
        <Checkbox colorScheme={'twGray'} size={'lg'} {...checkboxProps} />
      </Box>
      {/* Notes: Field */}
      <Box
        aria-label='box-field-component'
        // Notes: Marginleft is used to remove behave
        style={{ marginLeft: 0 }}
        flexGrow={1}
        h={'12'}
        display='flex'
        alignItems='center'
        {...boxFieldProps}
      >
        <Text textAlign={'left'} fontSize={'md'} {...textFieldProps}>
          {children}
        </Text>
      </Box>
      {/* Notes: Icon */}
      {!process.env.NEXT_PUBLIC_IS_RELEASE_FEATURE && (
        <Box
          aria-label='box-icon-component'
          // Notes: Marginleft is used to remove behave
          style={{ marginLeft: 0 }}
          h={'12'}
          display='flex'
          justifyContent={'center'}
          alignItems='center'
          px={'4'}
          {...boxIconProps}
        >
          <Icon as={isPriority ? HiStar : HiOutlineStar} w={6} h={6} textColor={'gray.400'} {...iconProps} />
        </Box>
      )}
    </HStack>
  )
}
