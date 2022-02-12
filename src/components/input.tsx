import React from 'react'
import type { BaseProps } from '~/src/types'

type InputProps = BaseProps<{}, 'input'>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref): JSX.Element => (
    <input className={`${className} w-full h-full py-2 px-4 border border-gray-300 rounded-md`} ref={ref} {...props} />
  ),
)

Input.displayName = 'Input'
