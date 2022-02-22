import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { InputProps, Input, Checkbox, CheckboxProps } from '@chakra-ui/react'

type InputChecklistProps = BaseProps<
  {
    InputProps: InputProps
    CheckboxPros: CheckboxProps
    queryFn?: any
  },
  'div'
>

export const InputChecklist = ({
  className,
  InputProps: { onBlur, ...InputProps },
  CheckboxPros: { onChange, ...CheckboxProps },
  ...props
}: InputChecklistProps) => {
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🪲 - e.target.checked', e.target.checked)
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🪲 - e.target.value', e.target.value)
  }
  return (
    <div className={`w-full h-12 flex items-center relative ${className}`} {...props}>
      <div className='absolute z-10 mx-4 mt-1'>
        <Checkbox onChange={handleCheckbox} {...CheckboxProps} />
      </div>
      <Input onBlur={handleInput} {...InputProps} />
    </div>
  )
}
