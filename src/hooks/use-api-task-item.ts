import * as React from 'react'
import type { TChecklistGroupEntity, TChecklistItemEntity } from '~/src/types'
import type { PostgrestResponse } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { useToast } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import { Verb, modifiedEntity, apiResponse } from '~/src/hooks/use-api-task-group'

// Notes: Supabase fetch
const selectTaskItem = async ({ queryKey }: { queryKey: Array<string | undefined> }) => {
  const response = await supabaseClient
    .from<TChecklistItemEntity>('$DB_checklist_item')
    .select('*')
    .eq('checklist_group_id', queryKey[1])
  return apiResponse(response)
}
const modifiedTaskItem = async ({ verb, ...taskItemEntity }: Partial<TChecklistItemEntity> & Verb) => {
  let response
  switch (verb) {
    case 'INSERT':
      response = await supabaseClient.from<TChecklistItemEntity>('$DB_checklist_item').insert([
        {
          title: taskItemEntity.title,
          is_completed: false,
          checklist_group_id: taskItemEntity.checklist_group_id,
        },
      ])
      break
    case 'UPDATE':
      response = await supabaseClient
        .from<TChecklistItemEntity>('$DB_checklist_item')
        .update({ ...taskItemEntity })
        .match({ id: taskItemEntity.id })
      break
    case 'DELETE':
      response = await supabaseClient
        .from<TChecklistItemEntity>('$DB_checklist_item')
        .delete()
        .match({ id: taskItemEntity.id })
      break
  }
  return apiResponse(response)
}

export const useApiTaskItem = (taskGroup: TChecklistGroupEntity) => {
  const renderToastComponent = useToast()
  const queryClient = useQueryClient()
  // Notes: Select
  const taskItemEntity = useQuery(['taskItem', taskGroup?.id], selectTaskItem, {
    enabled: !!taskGroup,
  })
  // Notes: Data Modified
  const taskItemMutation = useMutation(modifiedTaskItem, {
    onMutate: async ({ verb, ...freshTaskItemEntity }: Partial<TChecklistItemEntity> & Verb) => {
      await queryClient.cancelQueries(['taskItem', taskGroup?.id])
      const prevTaskItemEntity = queryClient.getQueryData(['taskItem', taskGroup?.id])
      queryClient.setQueryData(['taskItem', taskGroup?.id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistItemEntity> = { ...oldQueryData }
        const oldTaskItemEntity = $oldQueryData.data || []
        return {
          ...$oldQueryData,
          data: modifiedEntity({
            verb,
            oldEntity: oldTaskItemEntity,
            // Notes: Because we use optimistic update, we need to add (fake) id to the new entity for temporary use
            freshEntity: { id: uuidv4(), ...freshTaskItemEntity } as TChecklistItemEntity,
          }),
        }
      })
      return { prevTaskItemEntity }
    },
    onError: (_err, _newTodo, context) => {
      renderToastComponent({
        title: 'Failed',
        status: 'error',
        duration: null,
        isClosable: true,
        position: 'top',
      })
      queryClient.setQueryData(['taskItem', taskGroup?.id], context?.prevTaskItemEntity)
    },
    onSettled: (_entity, _error, _variables, _context) => {
      queryClient.invalidateQueries(['taskItem', taskGroup?.id])
    },
  })
  return { taskItemEntity, taskItemMutation }
}
