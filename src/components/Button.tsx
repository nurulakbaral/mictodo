import React from 'react'
import type { BaseProps } from '~/src/types'

type ButtonProps = BaseProps<{}, 'button'>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref): JSX.Element => (
    <button ref={ref} className={`${className} border-[1px] border-gray-200 shadow-md`} {...props}>
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
