import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabaseClient } from '~/src/libs/supabase-client'
import { Button } from '~/src/components/button'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/router'
import type { Session } from '@supabase/supabase-js'

export default function Home() {
  const router = useRouter()
  const [authorizedUser, setAuthorizedUser] = useState<Session | null | undefined>(null)
  // Notes: .onAuthStateChange will trigger when .signIn and .signOut are invoked (read: full reload and rendering won't invoked)
  supabaseClient.auth.onAuthStateChange((_, session) => {
    // Notes: !session only indicates loading when .signOut is invoked
    if (!session) {
      router.reload()
      return
    }
    setAuthorizedUser(session)
  })
  const handleLogin = async () => {
    await supabaseClient.auth.signIn({ provider: 'google' })
  }
  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.reload()
  }
  return (
    <>
      <Head>
        <title>Mictodo - Powerfull Todo List</title>
      </Head>
      <main className='pt-12'>
        <div>
          <h1 className='text-center text-8xl font-medium font-poppins'>Hello Mictodo</h1>
        </div>
        {!authorizedUser && (
          <div className='text-center mt-12 flex justify-center'>
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
