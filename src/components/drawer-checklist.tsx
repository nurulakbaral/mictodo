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
const selectChecklistItem = async ({ queryKey }: { queryKey: Array<string> }) =>
  await supabaseClient.from('$DB_checklist_item').select('*').match({ checklist_group_id: queryKey[1] })
const insertChecklistItem = async ({
  checklist_group_id,
  title,
}: Partial<Pick<TChecklistItemEntity, 'checklist_group_id' | 'title'>>) =>
  await supabaseClient.from<TChecklistItemEntity>('$DB_checklist_item').insert([
    {
      title,
      is_completed: false,
      checklist_group_id,
    },
  ])
const updateChecklistItem = async ({ id, title }: Partial<Pick<TChecklistItemEntity, 'id' | 'title'>>) =>
  await supabaseClient.from<TChecklistItemEntity>('$DB_checklist_item').update({ title }).match({ id })
// Notes: Checklist Group Fetch
const updateChecklistGroup = async ({ id, title }: Partial<Pick<TChecklistGroupEntity, 'id' | 'title'>>) =>
  await supabaseClient.from<TChecklistGroupEntity>('$DB_checklist_group').update({ title }).match({ id })

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
    console.log('🪲 - delete checklistItem')
  }
  const handleUpdateChecklistGroup = (title: string) => {
    mutateForUpdateCG({ id: checklistGroup.id, title })
  }
  const handleUpdateChecklistItem = (id: string) => {
    return (title: string) => {
      mutateForUpdateCI({ id, title })
    }
  }
  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose} size='sm'>
      <DrawerOverlay />
      <DrawerContent>
        <Box mb={8}>
          <DrawerCloseButton className='text-gray-400' />
        </Box>
        <DrawerHeader>Your Task</DrawerHeader>
        <DrawerBody>
          <Box mb={6}>
            {/* Parent */}
            <InputChecklist
              queryFn={handleUpdateChecklistGroup}
              CheckboxPros={{
                colorScheme: 'twGray',
                size: 'lg',
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
              checklisItem?.data?.data?.map(({ id, title }) => (
                <InputChecklist
                  queryFn={handleUpdateChecklistItem(id)}
                  key={`item-${id}`}
                  isCloseIcon={true}
                  onClose={() => handleDeleteChecklistItem(id)}
                  CheckboxPros={{
                    colorScheme: 'twGray',
                    size: 'lg',
                  }}
                  InputProps={{
                    colorScheme: 'white',
                    autoComplete: 'off',
                    className: 'font-poppins',
                    focusBorderColor: 'twGray.300',
                    pl: '12',
                    size: 'md',
                    value: title,
                  }}
                />
              ))}
            <form className='mx-auto mt-1' onSubmit={handleSubmit(handleAddChecklistItem)}>
              <InputTask
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
            <Textarea resize={'none'} placeholder='Add note' />
          </Box>
        </DrawerBody>
        <Divider />
        <DrawerFooter>
          <Flex justifyContent={'space-between'} alignItems={'center'} w='full'>
            <Box>
              <Text className='text-gray-500' fontSize={'md'}>
                Created 3 hours ago
              </Text>
            </Box>
            <Box>
              <Button colorScheme='white'>
                <TrashIcon className='w-6 h-6 text-gray-400' />
              </Button>
            </Box>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
