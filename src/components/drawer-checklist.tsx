import * as React from 'react'
import {
  Divider,
  Drawer,
  DrawerProps,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Button,
  UseDisclosureProps,
  Box,
  Flex,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { InputChecklist } from '~/src/components/input-checklist'
import { TrashIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import type { TChecklistGroupEntity, TChecklistItemEntity } from '~/src/types'
import { supabaseClient } from '~/src/libs/supabase-client'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { PostgrestResponse } from '@supabase/supabase-js'

type DrawerChecklistProps = { checklistGroup: TChecklistGroupEntity } & Pick<DrawerProps, 'placement'> &
  UseDisclosureProps
type FormValues = {
  checklistItem: string
}

// Notes: Checklist Item Fetch
const selectChecklistItem = async ({ queryKey }: { queryKey: Array<string> }) => {
  const response = await supabaseClient
    .from('$DB_checklist_item')
    .select('*')
    .match({ checklist_group_id: queryKey[1] })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}
const insertChecklistItem = async ({
  checklist_group_id,
  title,
}: Partial<Pick<TChecklistItemEntity, 'checklist_group_id' | 'title'>>) => {
  const response = await supabaseClient.from<TChecklistItemEntity>('$DB_checklist_item').insert([
    {
      title,
      is_completed: false,
      checklist_group_id,
    },
  ])
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}
const updateChecklistItem = async ({ id, title }: Partial<Pick<TChecklistItemEntity, 'id' | 'title'>>) => {
  const response = await supabaseClient.from<TChecklistItemEntity>('$DB_checklist_item').update({ title }).match({ id })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}
const deleteChecklistItem = async ({ id }: Partial<Pick<TChecklistItemEntity, 'id'>>) => {
  const response = await supabaseClient.from<TChecklistItemEntity>('$DB_checklist_item').delete().match({ id })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}

// Notes: Checklist Group Fetch
const updateChecklistGroup = async ({
  id,
  title,
  description,
  isOnlyUpdateDescription,
}: Pick<TChecklistGroupEntity, 'id' | 'title' | 'description'> & { isOnlyUpdateDescription: boolean }) => {
  const entity = isOnlyUpdateDescription ? { description } : { title }
  const response = await supabaseClient.from<TChecklistGroupEntity>('$DB_checklist_group').update(entity).match({ id })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}
const deleteChecklistGroup = async ({ id }: Partial<Pick<TChecklistGroupEntity, 'id'>>) => {
  const response = await supabaseClient.from<TChecklistGroupEntity>('$DB_checklist_group').delete().match({ id })
  if (response.error) {
    throw new Error(response.error.message)
  }
  return response
}

export const DrawerChecklist = ({
  checklistGroup,
  isOpen = false,
  onClose = () => {},
  placement = 'right',
}: DrawerChecklistProps) => {
  const renderToastComponent = useToast()
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const taskValue = watch('checklistItem')
  // Notes: Get Checklist Items
  const queryClient = useQueryClient()
  const checklisItem = useQuery(['checklistItem', checklistGroup.id], selectChecklistItem)
  // Notes: Insert Checklist Items
  const { mutate: mutateForInsertCI } = useMutation(insertChecklistItem, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistItemEntity>) => {
      renderToastComponent({
        title: 'Item-Task created.',
        status: 'success',
        duration: 800,
        position: 'top',
      })
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistItem', checklistGroup.id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistItemEntity> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        return {
          ...$oldQueryData,
          data: [...oldData, freshData],
        }
      })
    },
  })
  // Notes: Update Checklist Items
  const { mutate: mutateForUpdateCI } = useMutation(updateChecklistItem, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistItemEntity>) => {
      renderToastComponent({
        title: 'Item-Task updated.',
        status: 'success',
        duration: 800,
        isClosable: true,
        position: 'top',
      })
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistItem', checklistGroup.id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistItemEntity> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        const updateOldData = (old: TChecklistItemEntity) => (old.id === freshData.id ? freshData : old)
        return {
          ...$oldQueryData,
          data: oldData.map(updateOldData),
        }
      })
    },
  })
  // Notes: Update Checklist Group
  const { mutate: mutateForUpdateCG } = useMutation(updateChecklistGroup, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistGroupEntity>) => {
      renderToastComponent({
        title: 'Group-Task updated.',
        status: 'success',
        duration: 800,
        position: 'top',
      })
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistGroup', checklistGroup.user_id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistGroupEntity> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        const updateOldData = (old: TChecklistGroupEntity) => (old.id === freshData.id ? freshData : old)
        return {
          ...$oldQueryData,
          data: oldData.map(updateOldData),
        }
      })
    },
  })
  // Notes: Delete Checklist Group
  const { mutate: mutateForDeleteCG } = useMutation(deleteChecklistGroup, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistGroupEntity>) => {
      renderToastComponent({
        title: 'Group-Task deleted.',
        status: 'success',
        duration: 800,
        position: 'top',
      })
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistGroup', checklistGroup.user_id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistGroupEntity> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        const updateOldData = (old: TChecklistGroupEntity) => old.id !== freshData.id
        return {
          ...$oldQueryData,
          data: oldData.filter(updateOldData),
        }
      })
    },
    onError: () => {
      renderToastComponent({
        title: 'Failed to delete Group-Task!',
        description: 'Delete the Item-Task, then try again to delete the Group-Task.',
        status: 'error',
        duration: null,
        isClosable: true,
        position: 'top',
      })
    },
  })
  // Notes: Delete Checklist Items
  const { mutate: mutateForDeleteCI } = useMutation(deleteChecklistItem, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistItemEntity>) => {
      renderToastComponent({
        title: 'Item-Task deleted.',
        status: 'success',
        duration: 800,
        isClosable: true,
        position: 'top',
      })
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistItem', checklistGroup.id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistItemEntity> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        const updateOldData = (old: TChecklistItemEntity) => old.id !== freshData.id
        return {
          ...$oldQueryData,
          data: oldData.filter(updateOldData),
        }
      })
    },
  })
  const handleAddChecklistItem = async (values: FormValues) => {
    if (values.checklistItem === '') {
      alert('Please enter a checklistItem')
      return
    }
    if (checklistGroup) {
      mutateForInsertCI({ checklist_group_id: checklistGroup.id, title: values.checklistItem })
    }
    reset({
      checklistItem: '',
    })
  }
  const handleDeleteChecklistItem = (checklisItemId: string) => {
    mutateForDeleteCI({ id: checklisItemId })
  }
  const handleUpdateChecklistGroup = (title: string) => {
    mutateForUpdateCG({ id: checklistGroup.id, title, description: '', isOnlyUpdateDescription: false })
  }
  const handleUpdateChecklistItem = (id: string) => {
    return (title: string) => {
      mutateForUpdateCI({ id, title })
    }
  }
  const handleDeleteChecklistGroup = () => {
    mutateForDeleteCG({ id: checklistGroup.id })
    onClose()
  }
  const handleAddCGDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value
    mutateForUpdateCG({
      id: checklistGroup.id,
      title: '',
      description,
      isOnlyUpdateDescription: true,
    })
  }
  const handleAddCGDescriptionWithEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const description = e.currentTarget.value
    if (e.key === 'Enter') {
      mutateForUpdateCG({
        id: checklistGroup.id,
        title: '',
        description,
        isOnlyUpdateDescription: true,
      })
    }
  }
  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <Box>
          <DrawerCloseButton className='text-gray-400' />
        </Box>
        <DrawerHeader mt={12} mb={0}>
          <Divider />
        </DrawerHeader>
        <DrawerBody>
          <Box mb={6}>
            {/* Parent */}
            <InputChecklist
              ariaLabel='group'
              checklistItemId={checklistGroup.id}
              checklisGroupEntity={checklistGroup}
              queryInputValue={handleUpdateChecklistGroup}
              CheckboxPros={{
                colorScheme: 'twGray',
                size: 'lg',
                defaultChecked: checklistGroup.is_completed,
              }}
              InputProps={{
                colorScheme: 'white',
                autoComplete: 'off',
                className: 'font-poppins',
                focusBorderColor: 'twGray.300',
                pl: '12',
                size: 'lg',
                value: checklistGroup.title,
              }}
            />
          </Box>
          {/* Childs */}
          <Box mb={6}>
            {checklistGroup &&
              checklisItem?.data?.data?.map((checklisItem: TChecklistItemEntity) => (
                <InputChecklist
                  ariaLabel='item'
                  checklistItemId={checklisItem.id}
                  checklisGroupEntity={checklistGroup}
                  queryInputValue={handleUpdateChecklistItem(checklisItem.id)}
                  key={`item-${checklisItem.id}`}
                  isCloseIcon={true}
                  onClose={() => handleDeleteChecklistItem(checklisItem.id)}
                  CheckboxPros={{
                    colorScheme: 'twGray',
                    size: 'lg',
                    isChecked: checklisItem.is_completed,
                  }}
                  InputProps={{
                    colorScheme: 'white',
                    autoComplete: 'off',
                    className: 'font-poppins',
                    focusBorderColor: 'twGray.300',
                    pl: '12',
                    size: 'md',
                    value: checklisItem.title,
                  }}
                />
              ))}
            <form className='mx-auto mt-1' onSubmit={handleSubmit(handleAddChecklistItem)}>
              <InputTask
                variant='Add Item-Task'
                className='w-full'
                value={taskValue}
                InputProps={{
                  colorScheme: 'white',
                  autoComplete: 'off',
                  className: 'font-poppins',
                  focusBorderColor: 'twGray.400',
                  size: 'lg',
                  w: 'full',
                  ...register('checklistItem'),
                }}
              />
            </form>
          </Box>
          <Box>
            <Textarea
              onKeyPress={handleAddCGDescriptionWithEnter}
              onBlur={handleAddCGDescription}
              defaultValue={checklistGroup.description}
              resize={'none'}
              placeholder='Add note'
            />
          </Box>
        </DrawerBody>
        <Divider />
        <DrawerFooter>
          <Flex justifyContent={'space-between'} alignItems={'center'} w='full'>
            <Box>
              <Text className='text-gray-500' fontSize={'md'}>
                Have a nice day!
              </Text>
            </Box>
            <Box>
              <Button
                data-testid='btn-remove-checklist-group-unit'
                colorScheme='white'
                onClick={handleDeleteChecklistGroup}
              >
                <TrashIcon className='w-6 h-6 text-gray-400' />
              </Button>
            </Box>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
