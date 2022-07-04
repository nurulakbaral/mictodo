import * as React from 'react'
import type { ExtendsOptionalKeys } from '~/src/types'
import { PlusIcon } from '@heroicons/react/outline'
import { Input, Box, Text, FormControl } from '@chakra-ui/react'
import type { BoxProps, InputProps } from '@chakra-ui/react'

type TTextFieldAddTask = {
  boxProps?: BoxProps
  inputProps?: InputProps
  placeholder: string
}

type TextFieldAddTaskProps = ExtendsOptionalKeys<
  TTextFieldAddTask,
  undefined,
  {
    'data-testid'?: string
  }
>

const Placeholder = ({ placeholder }: Pick<TextFieldAddTaskProps, 'placeholder'>) => (
  <Box display={'flex'} alignItems={'center'} position={'absolute'} left={4} pointerEvents={'none'}>
    <PlusIcon className='w-6 h-6 mr-4 text-gray-500' />
    <Text color={'twGray.600'}>{placeholder}</Text>
  </Box>
)

export const TextFieldAddTask = ({ boxProps, inputProps, placeholder }: TextFieldAddTaskProps) => {
  // Notes: Remove value and onChange props from inputProps
  const { value, onChange, onKeyPress, ...$inputProps } = inputProps as InputProps
  const [inputValue, setInputValue] = React.useState<string | number | readonly string[] | undefined>('')
  const [togglePlaceholder, setTogglePlaceholder] = React.useState<boolean>(true)
  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange && onChange(e)
  }
  const handleEnterValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setInputValue('')
      onKeyPress && onKeyPress(e)
    }
  }
  // Notes: if value is NOT '' || undefined, don't show placeholder
  const handlePlaceholderFocus = () =>
    setTogglePlaceholder((prevState) =>
      !['', undefined].includes(inputValue as string | undefined) ? false : !prevState,
    )
  const handlePlaceholderBlur = () =>
    setTogglePlaceholder((prevState) =>
      !['', undefined].includes(inputValue as string | undefined) ? false : !prevState,
    )
  return (
    <Box
      aria-label={'text-field-add-task'}
      onFocus={handlePlaceholderFocus}
      onBlur={handlePlaceholderBlur}
      display={'flex'}
      position={'relative'}
      alignItems={'center'}
      h={12}
      {...boxProps}
    >
      {togglePlaceholder && <Placeholder placeholder={placeholder} />}
      <Input
        h={'full'}
        w={'full'}
        name='addTask'
        onChange={handleValue}
        value={inputValue}
        onKeyDown={handleEnterValue}
        type='text'
        {...$inputProps}
      />
    </Box>
  )
}
