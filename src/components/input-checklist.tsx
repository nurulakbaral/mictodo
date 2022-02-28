import * as React from 'react'
import type { BaseProps } from '~/src/types'
import { InputProps, Input, Checkbox, CheckboxProps } from '@chakra-ui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import _ from 'lodash'

type InputChecklistProps = BaseProps<
  {
    InputProps: InputProps
    CheckboxPros: CheckboxProps
    isCloseIcon?: boolean
    onClose?: () => void
    queryFn?: (value: string) => void
  },
  'div'
>

export const InputChecklist = ({
  className,
  isCloseIcon = false,
  onClose,
  queryFn,
  InputProps: { onChange, value = '', onBlur, defaultValue, onKeyPress, ...InputProps },
  CheckboxPros: { onChange: $checkboxOnChange, ...CheckboxProps },
  ...props
}: InputChecklistProps) => {
  const [inputValue, setInputValue] = React.useState('')
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {}
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handleSendData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (queryFn) {
      queryFn(value)
    }
  }
  const handleSendDataWithEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (queryFn && e.key === 'Enter') {
      queryFn(value)
    }
  }
  React.useEffect(() => {
    setInputValue(value as string)
  }, [value])
  return (
    <div className={`w-full h-12 flex items-center relative ${className}`} {...props}>
      <div className='absolute z-10 mx-4 mt-1'>
        <Checkbox onChange={handleCheckbox} {...CheckboxProps} />
      </div>
      <Input
        onBlur={handleSendData}
        onKeyPress={handleSendDataWithEnter}
        onChange={handleInput}
        value={inputValue}
        {...InputProps}
      />
      {isCloseIcon && (
        <div className='absolute z-10 mx-4 right-0'>
          <XCircleIcon onClick={onClose} className='h-4 w-4 text-gray-400 cursor-pointer hover:text-red-600' />
        </div>
      )}
    </div>
  )
}
