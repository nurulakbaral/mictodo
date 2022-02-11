import React from 'react'
import type { BaseProps } from '~/src/types'

type LayoutContainerProps = BaseProps<{}, 'div'>

export const LayoutContainer = ({ children, className = '', ...props }: LayoutContainerProps): JSX.Element => {
  return (
    <div className={`${className} bg-white max-w-xl mx-auto min-h-screen`} aria-label='layout-container' {...props}>
      {children}
    </div>
  )
}
