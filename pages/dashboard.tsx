import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { PlusIcon } from '@heroicons/react/outline'
import { Input } from '@chakra-ui/react'
import Link from 'next/link'

type FormValues = {
  task: string
}

export default function Dashboard() {
  const router = useRouter()
  const [placeholder, setPlaceholder] = React.useState<boolean>(true)
  const { register, handleSubmit: onSubmit, watch } = useForm<FormValues>()
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
    console.log(values)
  }
  const handlePlaceholderFocus = () => setPlaceholder((prevState) => (taskValue !== '' ? false : !prevState))
  const handlePlaceholderBlur = () => setPlaceholder((prevState) => (taskValue !== '' ? false : !prevState))
  return (
    <>
      <Head>
        <title>Mictodo - Powerfull Todo List</title>
      </Head>
      <main className='pt-12'>
        <div>
          <h1 className='text-4xl font-poppins text-center'>Hallo</h1>
          <h2 className='text-base font-poppins text-center'>{authorizedUser?.email}</h2>
        </div>
        <div className='pt-12 pb-36'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <div key={item} className='w-5/6 mx-auto h-12 flex items-center relative mb-2'>
              <Input
                colorScheme='white'
                autoComplete='off'
                className='font-poppins'
                focusBorderColor='twGray.400'
                size='lg'
                defaultValue={`My Task ${item}`}
              />
            </div>
          ))}
        </div>
        <div className='bg-white fixed bottom-0 right-0 left-0 pt-6 pb-12 border-t-2 border-gray-100 z-10'>
          <form className='//bg-green-400 max-w-xl mx-auto' onSubmit={onSubmit(handleSubmit)}>
            <div
              onFocus={handlePlaceholderFocus}
              onBlur={handlePlaceholderBlur}
              className='w-5/6 mx-auto h-12 flex items-center relative'
            >
              {placeholder && (
                <div className='flex items-center absolute left-4 pointer-events-none'>
                  <PlusIcon className='w-6 h-6 mr-4 text-gray-500' />
                  <h6 className='text-gray-700 text-base'>Add a task</h6>
                </div>
              )}
              <Input
                colorScheme='white'
                autoComplete='off'
                className='font-poppins'
                focusBorderColor='twGray.400'
                size='lg'
                {...register('task')}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
