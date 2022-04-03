import * as React from 'react'
import { Textarea } from '@chakra-ui/react'
import type { TextareaProps } from '@chakra-ui/react'
import type { ExtendsOptionalKeys } from '~/src/types'

export type TBaseTextarea = {
  textareaProps?: TextareaProps
}
export type BaseTextareaProps<T> = ExtendsOptionalKeys<
  T,
  {
    'data-testid'?: string
  }
>

export const BaseTextarea = ({ textareaProps = {} }: BaseTextareaProps<TBaseTextarea>) => {
  const { onChange, ...$textareaProps } = textareaProps as TextareaProps
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = React.useState<number | string>('auto')
  const [textareaValue, setTextareaValue] = React.useState<string>('')
  React.useEffect(() => {
    setTextareaHeight(textareaRef.current?.scrollHeight as number)
  }, [textareaValue])
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Notes: Textarea Auto-Resize https://medium.com/@lucasalgus/creating-a-custom-auto-resize-textarea-component-for-your-react-web-application-6959c0ad68bc
    setTextareaHeight('auto')
    setTextareaValue(e.target.value)
    if (onChange) {
      onChange(e)
    }
  }
  // Refactor: Optimize this component (rendering)
  return (
    <Textarea
      ref={textareaRef}
      onChange={handleTextarea}
      height={`${textareaHeight}px`}
      resize={'none'}
      overflow={'hidden'}
      {...$textareaProps}
    />
  )
}
