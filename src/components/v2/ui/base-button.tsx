import * as React from 'react'
import { Button } from '@chakra-ui/react'
import type { ButtonProps } from '@chakra-ui/react'
import type { ExtendsOptionalKeys } from '~/src/types'

export type TBaseButton = {
  buttonProps?: ButtonProps
  children: React.ReactNode
}
export type BaseButtonProps = ExtendsOptionalKeys<
  TBaseButton,
  undefined,
  {
    'data-testid'?: string
  }
>

export const BaseButton = ({ buttonProps = {}, children }: BaseButtonProps) => {
  return (
    <Button
      py={3}
      px={6}
      bgColor={'white'}
      boxShadow={'md'}
      border={'1px solid'}
      borderColor={'twGray.200'}
      width={'full'}
      height={'full'}
      fontWeight={'medium'}
      rounded={'md'}
      _hover={{
        bgColor: 'twGray.100',
      }}
      _active={{
        bgColor: 'twGray.50',
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  )
}
