import React from 'react'
import type { BaseProps } from '~/src/types'

type LayoutProps = BaseProps<{}, 'div'>

export const Layout = ({ children, className = '', ...props }: LayoutProps): JSX.Element => {
  return (
    <div className={`${className} bg-gray-100 min-h-screen`} aria-label='layout' {...props}>
      {children}
    </div>
  )
}
