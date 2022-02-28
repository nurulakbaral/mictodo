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
} from '@chakra-ui/react'
import { InputChecklist } from '~/src/components/input-checklist'
import { TrashIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import type { TChecklistGroupDB, TChecklistItemDB } from '~/src/types'
import { supabaseClient } from '~/src/libs/supabase-client'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { PostgrestResponse } from '@supabase/supabase-js'

type DrawerChecklistProps = { checklistGroup: TChecklistGroupDB } & Pick<DrawerProps, 'placement'> & UseDisclosureProps
type FormValues = {
  checklistItem: string
}

const selectChecklistItem = async ({ queryKey }: { queryKey: Array<string> }) =>
  await supabaseClient.from('checklist_item').select('*').match({ checklist_group_id: queryKey[1] })
const insertChecklistItem = async ({
  checklist_group_id,
  title,
}: Partial<Pick<TChecklistItemDB, 'checklist_group_id' | 'title'>>) =>
  await supabaseClient.from<TChecklistItemDB>('checklist_item').insert([
    {
      title,
      is_completed: false,
      is_priority: false,
      description: '',
      checklist_group_id,
    },
  ])
const updateChecklistGroup = async ({ id, title }: Partial<Pick<TChecklistGroupDB, 'id' | 'title'>>) =>
  await supabaseClient.from<TChecklistGroupDB>('checklist_group').update({ title }).match({ id })

export const DrawerChecklist = ({
  checklistGroup,
  isOpen = false,
  onClose = () => {},
  placement = 'right',
}: DrawerChecklistProps) => {
  const queryClient = useQueryClient()
  const checklisItem = useQuery(['checklistItem', checklistGroup.id], selectChecklistItem)
  const { mutate: mutateForInsertCI } = useMutation(insertChecklistItem, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistItemDB>) => {
      const freshData = freshQueryData.data || []
      queryClient.setQueryData(['checklistItem', checklistGroup.id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistItemDB> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        return {
          ...oldData,
          data: [...oldData, ...freshData],
        }
      })
    },
  })
  const { mutate: mutateForUpdateCG } = useMutation(updateChecklistGroup, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistGroupDB>) => {
      const [freshData] = freshQueryData.data || []
      queryClient.setQueryData(['checklistGroup', checklistGroup.user_id], (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistGroupDB> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        const updateOldData = (old: TChecklistGroupDB) => (old.id === freshData.id ? freshData : old)
        return {
          ...oldData,
          data: oldData.map(updateOldData),
        }
      })
    },
  })
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const taskValue = watch('checklistItem')
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
  const handleChecklistGroupUpdate = (title: string) => {
    mutateForUpdateCG({ id: checklistGroup.id, title })
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
              queryFn={handleChecklistGroupUpdate}
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
