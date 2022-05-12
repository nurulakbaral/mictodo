import React from 'react'
import type { BaseProps } from '~/src/types'

type InputBaseProps = BaseProps<{}, 'input'>

export const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
  ({ className, ...props }, ref): JSX.Element => (
    <input className={`${className} w-full h-full py-2 px-4 border border-gray-300 rounded-md`} ref={ref} {...props} />
  ),
)

InputBase.displayName = 'InputBase'
