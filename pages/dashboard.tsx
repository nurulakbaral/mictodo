import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { InputTask } from '~/src/components/input-task'
import { InputChecklist } from '~/src/components/input-checklist'
import { useAppDispatch, useAppSelector } from '~/src/hooks/useRedux'
import { addCheklist } from '~/src/store/features/cheklist'
import { DrawerBase } from '~/src/components/drawer-base'
import { useDisclosure } from '@chakra-ui/react'

type FormValues = {
  task: string
}

export default function Dashboard() {
  const router = useRouter()
  const checklist = useAppSelector((state) => state.cheklistFeature.cheklist)
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit: onSubmit, watch, reset } = useForm<FormValues>()
  const { data: authorizedUser, isLoading, isError } = useQuery('authorizedUser', () => supabaseClient.auth.user())
  const taskValue = watch('task')
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
  const handleSubmit = (values: FormValues) => {
    if (values.task === '') {
      alert('Please enter a task')
      return
    }
    dispatch(addCheklist(values.task))
    reset({
      task: '',
    })
  }
  return (
    <>
      <Head>
        <title>Mictodo - Powerfull Todo List</title>
      </Head>
      <main className='pt-12'>
        <DrawerBase isOpen={isOpen} onClose={onClose} />
        <div>
          <h1 className='text-4xl font-poppins text-center'>Hallo</h1>
          <h2 className='text-base font-poppins text-center'>{authorizedUser?.email}</h2>
        </div>
        <div className='pt-12 pb-36'>
          {checklist.map(({ id, value }) => (
            <InputChecklist
              key={id}
              CheckboxPros={{
                colorScheme: 'twGray',
              }}
              InputProps={{
                colorScheme: 'white',
                autoComplete: 'off',
                className: 'font-poppins cursor-default',
                focusBorderColor: 'twGray.400',
                pl: 12,
                size: 'lg',
                defaultValue: value,
                onClick: onOpen,
              }}
            />
          ))}
        </div>
        <div className='bg-white fixed bottom-0 right-0 left-0 pt-6 pb-12 border-t-2 border-gray-100 z-10'>
          <form className='//bg-green-400 max-w-xl mx-auto' onSubmit={onSubmit(handleSubmit)}>
            <InputTask
              value={taskValue}
              InputProps={{
                colorScheme: 'white',
                autoComplete: 'off',
                className: 'font-poppins',
                focusBorderColor: 'twGray.400',
                size: 'lg',
                ...register('task'),
              }}
            />
          </form>
        </div>
      </main>
    </>
  )
}
