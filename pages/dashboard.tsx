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
      <main className='pt-32'>
        <div>
          <h1>
            <Link href='/'>Home</Link>
          </h1>
        </div>
        <div>
          <h1 className='text-4xl font-poppins text-center'>Hallo</h1>
          <h2 className='text-base font-poppins text-center'>{authorizedUser?.email}</h2>
        </div>
        <form onSubmit={onSubmit(handleSubmit)}>
          <div
            onFocus={handlePlaceholderFocus}
            onBlur={handlePlaceholderBlur}
            className='mt-40 w-5/6 mx-auto h-12 flex items-center relative'
          >
            {placeholder && (
              <div className='flex items-center absolute left-4 pointer-events-none'>
                <PlusIcon className='w-6 h-6 mr-4 text-gray-500' />
                <h6 className='text-gray-700 text-base'>Add a task</h6>
              </div>
            )}
            <Input
              autoComplete='off'
              className='font-poppins'
              focusBorderColor='twGray.400'
              size='lg'
              {...register('task')}
            />
          </div>
        </form>
      </main>
    </>
  )
}
