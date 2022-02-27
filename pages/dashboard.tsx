import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import { useAppDispatch, useAppSelector } from '~/src/hooks/useRedux'
import { addCheklistGroup } from '~/src/store/features/cheklist-group'
import { DrawerCheklist } from '~/src/components/drawer-cheklist'
import { useDisclosure, Box, Text } from '@chakra-ui/react'
import { CheklistItem } from '~/src/components/cheklist-item'
import type { TCheklistGroup } from '~/src/store/features/cheklist-group'
import { ButtonBase } from '~/src/components/button-base'

type FormValues = {
  cheklistGroup: string
}

export default function Dashboard() {
  const router = useRouter()
  const checklistGroupData = useAppSelector((state) => state.cheklistGroup.cheklistGroupData)
  const dispatch = useAppDispatch()
  const [cheklistGroup, setCheklistGroup] = useState<TCheklistGroup | null | undefined>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, watch, reset } = useForm<FormValues>()
  const { data: authorizedUser, isLoading, isError } = useQuery('authorizedUser', () => supabaseClient.auth.user())
  const cheklistGroupValue = watch('cheklistGroup')
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
  const handleAddCheklistGroup = (values: FormValues) => {
    if (values.cheklistGroup === '') {
      alert('Please enter a task')
      return
    }
    dispatch(addCheklistGroup(values.cheklistGroup))
    reset({
      cheklistGroup: '',
    })
  }
  const handleShowDetailCheklist = (checklistGroup: TCheklistGroup) => {
    return () => {
      setCheklistGroup(checklistGroup)
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
            <CheklistItem
              key={checklistGroup.id}
              value={checklistGroup.value}
              onClick={handleShowDetailCheklist(checklistGroup)}
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
          <form className='//bg-green-400 max-w-xl mx-auto' onSubmit={handleSubmit(handleAddCheklistGroup)}>
            <InputTask
              value={cheklistGroupValue}
              InputProps={{
                colorScheme: 'white',
                autoComplete: 'off',
                className: 'font-poppins',
                focusBorderColor: 'twGray.400',
                size: 'lg',
                ...register('cheklistGroup'),
              }}
            />
          </form>
        </Box>
        <Box>
          <DrawerCheklist cheklistGroup={cheklistGroup} isOpen={isOpen} onClose={onClose} placement='right' />
        </Box>
      </main>
    </>
  )
}
