import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import { DrawerChecklist } from '~/src/components/drawer-checklist'
import { useDisclosure, Box, Text } from '@chakra-ui/react'
import { ChecklistItem } from '~/src/components/checklist-item'
import { ButtonBase } from '~/src/components/button-base'
import type { TChecklistGroupDB } from '~/src/types'
import { PostgrestResponse } from '@supabase/supabase-js'

type FormValues = {
  checklistGroup: string
}

const insertChecklistGroup = async ({ user_id, title }: Partial<Pick<TChecklistGroupDB, 'user_id' | 'title'>>) =>
  await supabaseClient.from<TChecklistGroupDB>('checklist_group').insert([
    {
      title,
      number_of_items: 0,
      completed_items: 0,
      uncompleted_items: 0,
      user_id,
    },
  ])
const selectChecklistGroup = async ({ queryKey }: { queryKey: Array<string | undefined> }) =>
  await supabaseClient.from('checklist_group').select('*').eq('user_id', queryKey[1])
const selectAuthorizedUser = async () => await supabaseClient.auth.user()

export default function Dashboard() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [checklistGroup, setChecklistGroup] = useState<TChecklistGroupDB | null | undefined>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const { data: authorizedUser, isLoading: isLoadingUser, isError } = useQuery('authorizedUser', selectAuthorizedUser)
  const checklistGroupDB = useQuery(['checklistGroup', authorizedUser?.id], selectChecklistGroup, {
    enabled: !!authorizedUser,
  })
  const { mutate } = useMutation(insertChecklistGroup, {
    onSuccess: (freshQueryData: PostgrestResponse<TChecklistGroupDB>) => {
      const freshData = freshQueryData.data || []
      queryClient.setQueryData('checklistGroup', (oldQueryData: any) => {
        // Notes: $oldQueryData variable is only used to get type oldQueryData
        const $oldQueryData: PostgrestResponse<TChecklistGroupDB> = { ...oldQueryData }
        const oldData = $oldQueryData.data || []
        return {
          ...oldData,
          data: [...oldData, ...freshData],
        }
      })
    },
  })
  const checklistGroupValue = watch('checklistGroup')
  if (isLoadingUser || checklistGroupDB.isLoading) {
    return (
      <div className='pt-40'>
        <ProgressCircular className='w-10 h-10 mx-auto text-gray-700' />
      </div>
    )
  }
  if (isError || checklistGroupDB.isError) {
    return router.push('/404')
  }
  const handleAddChecklistGroup = async (values: FormValues) => {
    if (values.checklistGroup === '') {
      alert('Please enter a task')
      return
    }
    mutate({ user_id: authorizedUser?.id, title: values.checklistGroup })
    reset({
      checklistGroup: '',
    })
  }
  const handleShowDetailChecklist = (checklistGroup: TChecklistGroupDB) => {
    return () => {
      setChecklistGroup(checklistGroup)
      onOpen()
    }
  }
  const handleRedirectToHome = () => {
    router.replace('/')
  }
  if (!authorizedUser) {
    return (
      <>
        <Head>
          <title>Mictodo - Login</title>
        </Head>
        <main className='pt-12'>
          <Box mt={32}>
            <Text textAlign={'center'}>You dont have access yet, please login first with a google account.</Text>
          </Box>
          <Box textAlign={'center'} display={'flex'} justifyContent={'center'} mt={12}>
            <ButtonBase
              onClick={handleRedirectToHome}
              className='py-3 px-6 rounded-md flex justify-center items-center font-medium font-poppins'
            >
              Back to Home
            </ButtonBase>
          </Box>
        </main>
      </>
    )
  }
  return (
    <>
      <Head>
        <title>Mictodo - Powerfull Todo List</title>
      </Head>
      <main className='pt-12'>
        <Box>
          <h1 className='text-4xl font-poppins text-center'>Hallo</h1>
          <h2 className='text-base font-poppins text-center'>{authorizedUser?.email}</h2>
        </Box>
        <Box className='pt-12 pb-36'>
          {checklistGroupDB?.data?.data?.map((checklistGroup) => (
            <ChecklistItem
              key={checklistGroup.id}
              value={checklistGroup.title}
              onClick={handleShowDetailChecklist(checklistGroup)}
              className='ring-2 ring-white hover:ring-gray-300 mb-3'
              CheckboxPros={{
                colorScheme: 'twGray',
                size: 'lg',
                className: 'mx-4',
              }}
              TextProps={{
                className: 'font-poppins cursor-default',
                fontSize: 'lg',
              }}
            />
          ))}
        </Box>
        <Box className='bg-white fixed bottom-0 right-0 left-0 pt-6 pb-12 border-t-2 border-gray-100 z-10'>
          <form className='//bg-green-400 max-w-xl mx-auto' onSubmit={handleSubmit(handleAddChecklistGroup)}>
            <InputTask
              value={checklistGroupValue}
              InputProps={{
                colorScheme: 'white',
                autoComplete: 'off',
                className: 'font-poppins',
                focusBorderColor: 'twGray.400',
                size: 'lg',
                ...register('checklistGroup'),
              }}
            />
          </form>
        </Box>
        <Box>
          <DrawerChecklist checklistGroup={checklistGroup} isOpen={isOpen} onClose={onClose} placement='right' />
        </Box>
      </main>
    </>
  )
}
