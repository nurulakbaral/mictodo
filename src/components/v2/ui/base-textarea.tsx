import * as React from 'react'
import { Textarea, useOutsideClick } from '@chakra-ui/react'
import type { TextareaProps } from '@chakra-ui/react'
import type { ExtendsOptionalKeys } from '~/src/types'

export type TBaseTextarea = {
  textareaProps?: TextareaProps
  withKeyEnter?: boolean
}
export type BaseTextareaProps = ExtendsOptionalKeys<
  TBaseTextarea,
  'withKeyEnter',
  {
    'data-testid'?: string
  }
>

export const BaseTextarea = ({ textareaProps = {}, withKeyEnter = true }: BaseTextareaProps) => {
  const { onChange, onKeyDown, bgColor = 'white', ...$textareaProps } = textareaProps as TextareaProps
  const ref = React.useRef(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = React.useState<number | string>('auto')
  const [textareaValue, setTextareaValue] = React.useState<string>('')
  const [bgColorFocus, setBgColorFocus] = React.useState<boolean>(false)
  React.useEffect(() => {
    setTextareaHeight(textareaRef.current?.scrollHeight as number)
  }, [textareaValue])
  useOutsideClick({
    ref: ref,
    handler: () => setBgColorFocus(false),
  })
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Notes: Textarea Auto-Resize https://medium.com/@lucasalgus/creating-a-custom-auto-resize-textarea-component-for-your-react-web-application-6959c0ad68bc
    setTextareaHeight('auto')
    setTextareaValue(e.target.value)
    onChange && onChange(e)
  }
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && withKeyEnter) {
      setBgColorFocus(true)
      e.currentTarget.blur()
      onKeyDown && onKeyDown(e)
    }
  }
  // Refactor: Optimize this component (rendering)
  return (
    <Textarea
      ref={textareaRef}
      onChange={handleTextareaChange}
      height={`${textareaHeight}px`}
      resize={'none'}
      overflow={'hidden'}
      onKeyDown={handleTextareaKeyDown}
      bgColor={bgColorFocus ? 'twGray.200' : bgColor}
      {...$textareaProps}
    />
  )
}
