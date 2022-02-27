import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import { useAppDispatch, useAppSelector } from '~/src/hooks/useRedux'
import { addChecklistGroup } from '~/src/store/features/checklist-group'
import { DrawerChecklist } from '~/src/components/drawer-checklist'
import { useDisclosure, Box, Text } from '@chakra-ui/react'
import { ChecklistItem } from '~/src/components/checklist-item'
import type { TChecklistGroup } from '~/src/store/features/checklist-group'
import { ButtonBase } from '~/src/components/button-base'

type FormValues = {
  checklistGroup: string
}

export default function Dashboard() {
  const router = useRouter()
  const checklistGroupData = useAppSelector((state) => state.checklistGroup.checklistGroupData)
  const dispatch = useAppDispatch()
  const [checklistGroup, setChecklistGroup] = useState<TChecklistGroup | null | undefined>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const { data: authorizedUser, isLoading, isError } = useQuery('authorizedUser', () => supabaseClient.auth.user())
  const { data } = useQuery('checklistGroupData', () => supabaseClient.from('checklist_group').select())
  console.log('🪲 - data', data)
  const checklistGroupValue = watch('checklistGroup')
  if (isLoading) {
    return (
      <div className='pt-40'>
        <ProgressCircular className='w-10 h-10 mx-auto text-gray-700' />
      </div>
    )
  }
  if (isError) {
    return router.push('/404')
  }
  const handleAddChecklistGroup = (values: FormValues) => {
    if (values.checklistGroup === '') {
      alert('Please enter a task')
      return
    }
    dispatch(addChecklistGroup(values.checklistGroup))
    reset({
      checklistGroup: '',
    })
  }
  const handleShowDetailChecklist = (checklistGroup: TChecklistGroup) => {
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
          {checklistGroupData.map((checklistGroup) => (
            <ChecklistItem
              key={checklistGroup.id}
              value={checklistGroup.value}
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
