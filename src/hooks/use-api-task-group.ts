import * as React from 'react'
import type { TChecklistGroupEntity, TChecklistItemEntity } from '~/src/types'
import type { PostgrestResponse, User } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { useToast } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'

type TTaskEntity = TChecklistGroupEntity | TChecklistItemEntity
export type Verb = {
  verb: 'INSERT' | 'UPDATE' | 'DELETE'
}

export const apiResponse = <T extends PostgrestResponse<TTaskEntity>>(response: T) => {
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}
export const modifiedEntity = ({
  verb,
  oldEntity,
  freshEntity,
}: {
  verb: string
  oldEntity: Array<TTaskEntity>
  freshEntity: TTaskEntity
}) => {
  switch (verb) {
    case 'INSERT':
      return [...oldEntity, freshEntity]
    case 'UPDATE':
      return oldEntity.map((oldItem: TTaskEntity) => (oldItem.id === freshEntity.id ? freshEntity : oldItem))
    case 'DELETE':
      return oldEntity.filter((oldItem: TTaskEntity) => oldItem.id !== freshEntity.id)
    default:
      return [{ error: 'Unsupported verb' }]
  }
}

// Notes: Supabase fetch
const selectTaskGroup = async ({ queryKey }: { queryKey: Array<string | undefined> }) => {
  const response = await supabaseClient
    .from<TChecklistGroupEntity>('$DB_checklist_group')
    .select('*')
    .eq('user_id', queryKey[1])
  if (response.error) {
    throw new Error(response.error.message)
  }
  return apiResponse(response)
}
const modifiedTaskGroup = async ({ verb, ...taskGroupEntity }: Partial<TChecklistGroupEntity> & Verb) => {
  let response
  switch (verb) {
    case 'INSERT':
      response = await supabaseClient.from<TChecklistGroupEntity>('$DB_checklist_group').insert([
        {
          title: taskGroupEntity.title,
          description: '',
          is_completed: false,
          is_priority: false,
          user_id: taskGroupEntity.user_id,
        },
      ])
      break
    case 'UPDATE':
      response = await supabaseClient
        .from<TChecklistGroupEntity>('$DB_checklist_group')
        .update({ ...taskGroupEntity })
        .match({ id: taskGroupEntity.id })
      break
    case 'DELETE':
      response = await supabaseClient
        .from<TChecklistGroupEntity>('$DB_checklist_group')
        .delete()
        .match({ id: taskGroupEntity.id })
      break
  }
  return apiResponse(response)
}

export const useApiTaskGroup = () => {
  const renderToastComponent = useToast()
  const queryClient = useQueryClient()
  const authorizedUser: User | undefined | null = queryClient.getQueryData('authorizedUser')
  // Notes: Select
  const taskGroupEntity = useQuery(['taskGroup', authorizedUser?.id], selectTaskGroup, {
    enabled: !!authorizedUser,
  })
  // Notes: Data Modified
  const taskGroupMutation = useMutation(modifiedTaskGroup, {
    onMutate: async ({ verb, ...freshTaskGroupEntity }: Partial<TChecklistGroupEntity> & Verb) => {
      await queryClient.cancelQueries(['taskGroup', authorizedUser?.id])
      const prevTaskGroupEntity = queryClient.getQueryData(['taskGroup', authorizedUser?.id])
      renderToastComponent({
        title: 'Success!',
        status: 'success',
        duration: 800,
        position: 'top',
      })
      queryClient.setQueryData(['taskGroup', authorizedUser?.id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistGroupEntity> = { ...oldQueryData }
        const oldTaskGroupEntity = $oldQueryData.data || []
        return {
          ...$oldQueryData,
          data: modifiedEntity({
            verb,
            oldEntity: oldTaskGroupEntity,
            // Notes: Because we use optimistic update, we need to add (fake) id to the new entity for temporary use
            freshEntity: { id: uuidv4(), ...freshTaskGroupEntity } as TChecklistGroupEntity,
          }),
        }
      })
      return { prevTaskGroupEntity }
    },
    onError: (_err, _newTodo, context) => {
      renderToastComponent({
        title: 'Failed!',
        description: 'Delete the Task-Item, then try again to delete the Task-Group.',
        status: 'error',
        duration: null,
        isClosable: true,
        position: 'top',
      })
      queryClient.setQueryData(['taskGroup', authorizedUser?.id], context?.prevTaskGroupEntity)
    },
    onSettled: (_entity, error, _freshEntity, _context) => {
      queryClient.invalidateQueries(['taskGroup', authorizedUser?.id])
    },
  })
  return { taskGroupEntity, taskGroupMutation }
}
