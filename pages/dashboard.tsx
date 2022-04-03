import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import { DrawerChecklist } from '~/src/components/drawer-checklist'
import { useDisclosure, Box, Text } from '@chakra-ui/react'
import { ChecklistItem } from '~/src/components/checklist-item'
import { ButtonBase } from '~/src/components/button-base'
import type { TChecklistGroupEntity } from '~/src/types'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'
import { DrawerTask } from '~/src/components/v2/drawer-task'

type FormValues = {
  checklistGroup: string
}

const selectAuthorizedUser = async () => await supabaseClient.auth.user()
export default function Dashboard() {
  const router = useRouter()
  const [checklistGroup, setChecklistGroup] = useState<TChecklistGroupEntity | null | undefined>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const { data: authorizedUser, isLoading, isError } = useQuery('authorizedUser', selectAuthorizedUser)
  const { taskGroupEntity, taskGroupMutation } = useApiTaskGroup()
  const checklistGroupValue = watch('checklistGroup')
  if (isLoading || authorizedUser === undefined) {
    return (
      <div className='pt-40'>
        <ProgressCircular className='w-10 h-10 mx-auto text-gray-700' />
      </div>
    )
  }
  if (isError) {
    return router.push('/404')
  }
  const handleAddTaskGroup = async (values: FormValues) => {
    if (values.checklistGroup === '') {
      alert('Please enter a task')
      return
    }
    taskGroupMutation.mutate({
      user_id: authorizedUser?.id,
      title: values.checklistGroup,
      $options: { verb: 'INSERT' },
    })
    reset({
      checklistGroup: '',
    })
  }
  const handleShowDetailTaskGroup = (checklistGroup: TChecklistGroupEntity) => {
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
          <link rel='icon' href='/icons/icon-48x48.png' />
          <link rel='manifest' href='/manifest.json' />
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
      <Box pt={8}>
        <Box>
          <h1 className='text-4xl font-poppins text-center'>Hallo</h1>
          <h2 className='text-base font-poppins text-center'>{authorizedUser?.email}</h2>
        </Box>
        <Box className='pt-12 pb-36'>
          {taskGroupEntity?.data?.data?.map((taskGroup) => (
            <ChecklistItem
              key={taskGroup.id}
              checklisGroupEntity={taskGroup}
              onClick={handleShowDetailTaskGroup(taskGroup)}
              className='ring-2 ring-white hover:ring-gray-300 mb-3'
              CheckboxPros={{
                colorScheme: 'twGray',
                size: 'lg',
                className: 'mx-4',
                isChecked: taskGroup.is_completed,
              }}
              TextProps={{
                className: 'font-poppins cursor-default',
                fontSize: 'lg',
              }}
            />
          ))}
        </Box>
        <Box className='bg-white fixed bottom-0 right-0 left-0 pt-6 pb-12 border-t-2 border-gray-100 z-10'>
          <form
            data-testid='checklist-group-form'
            className='max-w-xl mx-auto'
            onSubmit={handleSubmit(handleAddTaskGroup)}
          >
            <InputTask
              variant='Add Task-Group'
              value={checklistGroupValue}
              dataTestId='checklist-group-input'
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
          {checklistGroup && isOpen && (
            <DrawerTask taskGroup={checklistGroup} isOpen={isOpen} onClose={onClose} placement='right' />
          )}
        </Box>
      </Box>
    </>
  )
}
