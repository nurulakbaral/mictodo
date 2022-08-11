import { supabaseClient } from '~/src/libs/supabase-client'
import type { TTaskGroupEntity, TTaskItemEntity } from '~/src/types'

/**
 *
 *  Task Group API Services
 *
 */

export async function apiSelectTaskGroup({ user_id }: Partial<TTaskGroupEntity>) {
  return supabaseClient.from<TTaskGroupEntity>('$DB_checklist_group').select('*').eq('user_id', user_id)
}

export async function apiAddTaskGroup({ title, user_id }: Partial<TTaskGroupEntity>) {
  return supabaseClient.from<TTaskGroupEntity>('$DB_checklist_group').insert([
    {
      title,
      description: '',
      is_completed: false,
      is_priority: false,
      user_id: user_id,
    },
  ])
}

export async function apiUpdateTaskGroup({ id, ...taskGroupEntity }: Partial<TTaskGroupEntity>) {
  return supabaseClient
    .from<TTaskGroupEntity>('$DB_checklist_group')
    .update({ ...taskGroupEntity })
    .match({ id })
}

export async function apiDeleteTaskGroup({ id }: Partial<TTaskGroupEntity>) {
  return supabaseClient.from<TTaskGroupEntity>('$DB_checklist_group').delete().match({ id })
}
