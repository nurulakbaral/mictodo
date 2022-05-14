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
export type ExtendsProperties<T, K extends keyof T, Options> = {
  [P in keyof T]: P extends K ? T[P] & Options : T[P]
}
export type UnExtendsProperties<T, K extends keyof T, Options> = ExtendsProperties<T, Exclude<keyof T, K>, Options>
export type ExtendsOptionalKeys<T, K extends keyof T | undefined, Options> = {
  [P in keyof T]: undefined extends T[P] ? (P extends K ? T[P] : T[P] & Options) : T[P]
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
export type TTaskGroupEntity = {
  title: string
  description: string
  is_completed: boolean
  is_priority: boolean
  user_id: string
} & TDefaultEntity
export type TTaskItemEntity = {
  title: string
  is_completed: boolean
  checklist_group_id: string
} & TDefaultEntity
