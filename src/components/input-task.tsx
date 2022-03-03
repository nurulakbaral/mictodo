import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { PlusIcon } from '@heroicons/react/outline'
import { InputProps, Input } from '@chakra-ui/react'

type InputTaskProps = BaseProps<
  {
    value: string
    variant: string
    InputProps?: InputProps
  },
  'div'
>

const VariantPlaceholder = ({ variant }: Pick<InputTaskProps, 'variant'>) => (
  <div className='flex items-center absolute left-4 pointer-events-none'>
    <PlusIcon className='w-6 h-6 mr-4 text-gray-500' />
    <h6 className='text-gray-700 text-base'>{variant}</h6>
  </div>
)

export const InputTask = ({ variant, className, value, InputProps, ...props }: InputTaskProps) => {
  const [placeholder, setPlaceholder] = React.useState<boolean>(true)
  // Notes: if value is NOT '' || undefined, don't show placeholder
  const handlePlaceholderFocus = () =>
    setPlaceholder((prevState) => (!['', undefined].includes(value) ? false : !prevState))
  const handlePlaceholderBlur = () =>
    setPlaceholder((prevState) => (!['', undefined].includes(value) ? false : !prevState))
  return (
    <div
      onFocus={handlePlaceholderFocus}
      onBlur={handlePlaceholderBlur}
      className={`${className} w-5/6 mx-auto h-12 flex items-center relative`}
      {...props}
    >
      {placeholder && <VariantPlaceholder variant={variant} />}
      <Input data-testid='checklist-group-input' {...InputProps} />
    </div>
  )
}
