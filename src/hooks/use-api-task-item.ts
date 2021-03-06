import * as React from 'react'
import type { TTaskGroupEntity, TTaskItemEntity } from '~/src/types'
import type { PostgrestResponse } from '@supabase/supabase-js'
import type { UseToastOptions } from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { TOptions, modifiedEntity, apiResponse } from '~/src/hooks/use-api-task-group'
import { renderToastComponent } from '~/src/libs/toast'

// Notes: Supabase fetch
const selectTaskItem = async ({ queryKey }: { queryKey: Array<string | undefined> }) => {
  const response = await supabaseClient
    .from<TTaskItemEntity>('$DB_checklist_item')
    .select('*')
    .eq('checklist_group_id', queryKey[1])
  return apiResponse(response)
}
const modifiedTaskItem = async ({ $options, ...taskItemEntity }: Partial<TTaskItemEntity> & TOptions) => {
  let response
  const { verb } = $options
  switch (verb) {
    case 'INSERT':
      response = await supabaseClient.from<TTaskItemEntity>('$DB_checklist_item').insert([
        {
          title: taskItemEntity.title,
          is_completed: false,
          checklist_group_id: taskItemEntity.checklist_group_id,
        },
      ])
      break
    case 'UPDATE':
      response = await supabaseClient
        .from<TTaskItemEntity>('$DB_checklist_item')
        .update({ ...taskItemEntity })
        .match({ id: taskItemEntity.id })
      break
    case 'DELETE':
      response = await supabaseClient
        .from<TTaskItemEntity>('$DB_checklist_item')
        .delete()
        .match({ id: taskItemEntity.id })
      break
  }
  return apiResponse(response)
}

export const useApiTaskItem = (taskGroup: TTaskGroupEntity) => {
  const queryClient = useQueryClient()
  // Notes: Select
  const taskItemEntity = useQuery(['taskItem', taskGroup?.id], selectTaskItem, {
    enabled: !!taskGroup,
  })
  // Notes: Modify data (INSERT, UPDATE, DELETE)
  const taskItemMutation = useMutation(modifiedTaskItem, {
    onSuccess: (
      freshResponse: PostgrestResponse<TTaskItemEntity>,
      argsTaskItemEntity: Partial<TTaskItemEntity> & TOptions,
    ) => {
      const { verb } = argsTaskItemEntity.$options
      const freshTaskItemEntity = freshResponse?.data || []
      queryClient.setQueryData(['taskItem', taskGroup?.id], (staleResponse: any) => {
        // Notes: $staleResponse variable is only used to get type staleResponse
        const $staleResponse: PostgrestResponse<TTaskItemEntity> = { ...staleResponse }
        const staleTaskItemEntity = $staleResponse.data || []
        return {
          ...$staleResponse,
          data: modifiedEntity({
            verb,
            oldEntity: staleTaskItemEntity,
            freshEntity: freshTaskItemEntity[0],
          }),
        }
      })
    },
    onError: (_err, argsTaskItemEntity, _context) => {
      const { alertInfo } = argsTaskItemEntity.$options
      const defaultInfo: UseToastOptions = {
        title: 'Error',
        status: 'error',
        duration: null,
        isClosable: true,
        position: 'top',
      }
      renderToastComponent({
        ...defaultInfo,
        ...alertInfo?.onError,
      })
    },
  })
  return { taskItemEntity, taskItemMutation }
}
