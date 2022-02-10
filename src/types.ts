import * as React from 'react'

export type As<Props = any> = React.ElementType<Props>
export type BaseProps<OptionsProps, HTMLElementName extends As> = OptionsProps &
  React.ComponentPropsWithoutRef<HTMLElementName>
