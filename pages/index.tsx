import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabaseClient } from '~/src/libs/supabase-client'
import { Button } from '~/src/components/button'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/router'
import type { Session } from '@supabase/supabase-js'
import { ProgressCircular } from '~/src/components/progress-circular'

export default function Home() {
  const router = useRouter()
  const [authorizedUser, setAuthorizedUser] = useState<Session | null | undefined>(undefined)
  // Notes: .onAuthStateChange will trigger when .signIn and .signOut are invoked (read: full reload and rendering won't invoked)
  supabaseClient.auth.onAuthStateChange((_, session) => {
    // Notes: !session only indicates loading when .signOut is invoked
    if (!session) {
      router.reload()
      return
    }
    setTimeout(() => {
      setAuthorizedUser(session)
    }, 800)
    router.push('/dashboard')
  })
  const handleLogin = async () => await supabaseClient.auth.signIn({ provider: 'google' })
  const handleLogout = async () => await supabaseClient.auth.signOut()
  useEffect(() => {
    const authorizedUserRestored: Session | null = JSON.parse(localStorage.getItem('supabase.auth.token') as string)
    setTimeout(() => {
      setAuthorizedUser(authorizedUserRestored)
    }, 800)
  }, [])
  if (authorizedUser === undefined) {
    return (
      <div className='pt-40'>
        <ProgressCircular className='w-10 h-10 mx-auto text-gray-700' />
      </div>
    )
  }
  return (
    <>
      <Head>
        <title>Mictodo - Powerfull Todo List</title>
      </Head>
      <main className='pt-32'>
        <div className='mx-auto w-5/6 mb-40'>
          <h1 className='text-center text-6xl font-medium font-poppins mb-6'>Mictodo</h1>
          <h2 className='text-center text-base font-poppins text-gray-600'>
            The drawback of most <span className='font-bold'>To Do</span> applications is the absence of an Activity
            List. Mictodo comes with it 🤟
          </h2>
        </div>
        {!authorizedUser && (
          <div className='text-center flex justify-center'>
            <Button onClick={handleLogin} className='py-3 px-6 rounded-md flex justify-center items-center'>
              <FcGoogle className='w-8 h-8 mr-4' />
              <h1 className='text-lg font-medium'>Login with Google</h1>
            </Button>
          </div>
        )}
        {authorizedUser && (
          <div className='text-center mt-12 flex justify-center'>
            <Button onClick={handleLogout} className='py-3 px-6 rounded-md flex justify-center items-center'>
              <h1 className='text-lg font-medium font-poppins'>Sign out</h1>
            </Button>
          </div>
        )}
      </main>
    </>
  )
}
