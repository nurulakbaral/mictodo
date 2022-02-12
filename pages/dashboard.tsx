import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'

export default function Dashboard() {
  const router = useRouter()
  const { data: authorizedUser, isLoading, isError } = useQuery('authorizedUser', () => supabaseClient.auth.user())
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
  return (
    <>
      <Head>
        <title>Mictodo - Powerfull Todo List</title>
      </Head>
      <main className='pt-32'>
        <div>
          <h1 className='text-4xl font-poppins text-center'>Hallo</h1>
          <h2 className='text-base font-poppins text-center'>{authorizedUser?.email}</h2>
        </div>
      </main>
    </>
  )
}
