import * as React from 'react'
import type { TTaskGroupEntity, TTaskItemEntity } from '~/src/types'
import type { PostgrestResponse } from '@supabase/supabase-js'
import type { UseToastOptions } from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { TOptions, modifiedEntity, apiResponse } from '~/src/hooks/use-api-task-group'
import { renderToastComponent } from '~/src/libs/toast'
import { apiSelectTaskItem, apiAddTaskItem, apiUpdateTaskItem, apiDeleteTaskItem } from '~/src/services/supabase'

const selectTaskItem = async ({ queryKey }: { queryKey: Array<string | undefined> }) => {
  const response = await apiSelectTaskItem({ checklist_group_id: queryKey[1] })
  return apiResponse(response)
}

const modifiedTaskItem = async ({ $options, ...taskItemEntity }: Partial<TTaskItemEntity> & TOptions) => {
  let response
  const { verb } = $options
  switch (verb) {
    case 'INSERT':
      response = await apiAddTaskItem(taskItemEntity)
      break
    case 'UPDATE':
      response = await apiUpdateTaskItem(taskItemEntity)
      break
    case 'DELETE':
      response = await apiDeleteTaskItem(taskItemEntity)
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
