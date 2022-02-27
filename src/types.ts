import * as React from 'react'

export type As<Props = any> = React.ElementType<Props>
export type BaseProps<OptionsProps, HTMLElementName extends As> = OptionsProps &
  React.ComponentPropsWithoutRef<HTMLElementName>

// Notes: Supabase Database Types
export type TDefaultDB = {
  id: string
  created_at?: Date
  updated_at?: Date
}
export type TUserDB = {
  full_name: string
  email: string
} & TDefaultDB
export type TChecklistGroupDB = {
  title: string
  number_of_items: number
  completed_items: number
  uncompleted_items: number
  user_id: string
} & TDefaultDB
