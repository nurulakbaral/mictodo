import { Spinner, SpinnerProps } from '@chakra-ui/react'
import { ExtendsOptionalKeys } from '~/src/types'

export type TProgressSpinner = {
  spinnerProps?: SpinnerProps
}
export type ProgressSpinnerProps = ExtendsOptionalKeys<
  TProgressSpinner,
  undefined,
  {
    'data-testid'?: string
  }
>

export const ProgressSpinner = ({ spinnerProps = {} }: ProgressSpinnerProps) => {
  return <Spinner size={'lg'} {...spinnerProps} />
}
