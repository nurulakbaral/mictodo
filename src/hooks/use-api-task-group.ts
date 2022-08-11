import * as React from 'react'
import type { TTaskGroupEntity, TTaskItemEntity } from '~/src/types'
import type { PostgrestResponse, User } from '@supabase/supabase-js'
import type { UseToastOptions } from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { renderToastComponent } from '~/src/libs/toast'
import { apiSelectTaskGroup, apiAddTaskGroup, apiDeleteTaskGroup, apiUpdateTaskGroup } from '~/src/services/supabase'

type TTaskEntity = TTaskGroupEntity | TTaskItemEntity
export type TVerb = 'INSERT' | 'UPDATE' | 'DELETE'
export type TOptions = {
  $options: {
    verb: TVerb
    alertInfo?: {
      onSuccess?: UseToastOptions
      onError?: UseToastOptions
    }
  }
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
  const response = await apiSelectTaskGroup({ user_id: queryKey[1] })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return apiResponse(response)
}
const modifiedTaskGroup = async ({ $options, ...taskGroupEntity }: Partial<TTaskGroupEntity> & TOptions) => {
  let response
  const { verb } = $options
  switch (verb) {
    case 'INSERT':
      response = await apiAddTaskGroup(taskGroupEntity)
      break
    case 'UPDATE':
      response = await apiUpdateTaskGroup(taskGroupEntity)
      break
    case 'DELETE':
      response = await apiDeleteTaskGroup(taskGroupEntity)
      break
  }
  return apiResponse(response)
}

export const useApiTaskGroup = () => {
  const queryClient = useQueryClient()
  const authorizedUser: User | undefined | null = queryClient.getQueryData('authorizedUser')
  // Notes: Select
  const taskGroupEntity = useQuery(['taskGroup', authorizedUser?.id], selectTaskGroup, {
    enabled: !!authorizedUser,
  })
  // Notes: Modify data (INSERT, UPDATE, DELETE)
  const taskGroupMutation = useMutation(modifiedTaskGroup, {
    onSuccess: (
      freshResponse: PostgrestResponse<TTaskGroupEntity>,
      argsTaskGroupEntity: Partial<TTaskGroupEntity> & TOptions,
    ) => {
      const { verb } = argsTaskGroupEntity.$options
      const freshTaskGroupEntity = freshResponse?.data || []
      queryClient.setQueryData(['taskGroup', authorizedUser?.id], (staleResponse: any) => {
        // Notes: $staleResponse variable is only used to get type staleResponse
        const $staleResponse: PostgrestResponse<TTaskGroupEntity> = { ...staleResponse }
        const staleTaskGroupEntity = $staleResponse.data || []
        return {
          ...$staleResponse,
          data: modifiedEntity({
            verb,
            oldEntity: staleTaskGroupEntity,
            freshEntity: freshTaskGroupEntity[0],
          }),
        }
      })
    },
    onError: (_err, argsTaskGroupEntity, _context) => {
      const { alertInfo } = argsTaskGroupEntity.$options
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
  return { taskGroupEntity, taskGroupMutation }
}
