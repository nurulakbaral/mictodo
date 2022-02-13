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
  CheckboxPros: { onChange, size, ...CheckboxProps },
  ...props
}: InputChecklistProps) => {
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🪲 - e.target.checked', e.target.checked)
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🪲 - e.target.value', e.target.value)
  }
  return (
    <div className='w-5/6 mx-auto h-12 flex items-center relative mb-2' {...props}>
      <div className='absolute z-10 mx-4 mt-1'>
        <Checkbox onChange={handleCheckbox} size='lg' {...CheckboxProps} />
      </div>
      <Input onBlur={handleInput} {...InputProps} />
    </div>
  )
}
