import * as React from 'react'

export type As<Props = any> = React.ElementType<Props>
export type BaseProps<OptionsProps, HTMLElementName extends As> = OptionsProps &
  React.ComponentPropsWithoutRef<HTMLElementName>

// Notes: Supabase Database Types
export type TDefaultEntity = {
  id: string
  created_at?: Date
  updated_at?: Date
}
export type TUserEntity = {
  full_name: string
  email: string
} & TDefaultEntity
export type TChecklistGroupEntity = {
  title: string
  description: string
  is_completed: boolean
  is_priority: boolean
  user_id: string
} & TDefaultEntity
export type TChecklistItemEntity = {
  title: string
  is_completed: boolean
  checklist_group_id: string
} & TDefaultEntity
