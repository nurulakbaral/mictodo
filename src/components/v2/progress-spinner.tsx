import { Spinner, SpinnerProps } from '@chakra-ui/react'
import { ExtendsOptionalKeys } from '~/src/types'

export type TProgressSpinner = {
  spinnerProps?: SpinnerProps
}
export type ProgressSpinnerProps<T> = ExtendsOptionalKeys<
  T,
  {
    'data-testid'?: string
  }
>

export const ProgressSpinner = ({ spinnerProps = {} }: ProgressSpinnerProps<TProgressSpinner>) => {
  return <Spinner size={'lg'} {...spinnerProps} />
}
