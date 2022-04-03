import * as React from 'react'

/**
 *
 * Notes: Utils Type
 *
 */

export type As<Props = any> = React.ElementType<Props>
export type BaseProps<OptionsProps, HTMLElementName extends As> = OptionsProps &
  React.ComponentPropsWithoutRef<HTMLElementName>
export type PickRequiredKeys<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}
export type PickOptionalKeys<T> = Omit<T, keyof PickRequiredKeys<T>>
export type ExtendsKeys<T, Options> = {
  [P in keyof T]?: T[P] & Options
}
export type ExtendsOptionalKeys<T, Options> = {
  [P in keyof T]: undefined extends T[P] ? T[P] & Options : T[P]
}

/**
 *
 * Notes: Suapabase Type
 *
 */

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
