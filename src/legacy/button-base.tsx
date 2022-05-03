import React from 'react'
import type { BaseProps } from '~/src/types'

type ButtonBaseProps = BaseProps<{}, 'button'>

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ children, className = '', ...props }, ref): JSX.Element => (
    <button
      className={`${className} border-[1px] border-gray-200 shadow-md`}
      aria-label='login-button'
      ref={ref}
      {...props}
    >
      {children}
    </button>
  ),
)

ButtonBase.displayName = 'ButtonBase'
