import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabaseClient } from '~/src/libs/supabase-client'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/router'
import type { Session } from '@supabase/supabase-js'
import { ProgressSpinner } from '~/src/components/v2/ui/progress-spinner'
import { Box, Text } from '@chakra-ui/react'
import { BaseButton } from '~/src/components/v2/ui/base-button'

export default function Home() {
  const router = useRouter()
  const [authorizedUser, setAuthorizedUser] = useState<Session | null | undefined>(undefined)
  // Notes: .onAuthStateChange will trigger when .signIn and .signOut are invoked (read: full reload and rendering won't invoked)
  supabaseClient.auth.onAuthStateChange(async (_, session) => {
    // Notes: !session only indicates loading when .signOut is invoked
    const userId = session?.user?.id
    if (!session) {
      router.reload()
      return
    }
    const inspectUser = await supabaseClient.from('users').select('id').eq('id', userId)
    if (!inspectUser.data?.length) {
      await supabaseClient
        .from('users')
        .insert([{ id: userId, full_name: session?.user?.user_metadata.name, email: session?.user?.email }])
    }
    router.push('/dashboard')
  })
  useEffect(() => {
    const authorizedUserRestored: Session | null = JSON.parse(localStorage.getItem('supabase.auth.token') as string)
    const loadingIndicator = setTimeout(() => {
      setAuthorizedUser(authorizedUserRestored)
    }, 800)
    return () => {
      clearTimeout(loadingIndicator)
    }
  }, [])
  const handleLogin = async () => await supabaseClient.auth.signIn({ provider: 'google' })
  const handleLogout = async () => await supabaseClient.auth.signOut()
  const handleRedirectToDashboard = () => router.push('/dashboard')
  if (authorizedUser === undefined) {
    return (
      <Box pt={40} display={'flex'} justifyContent={'center'}>
        <ProgressSpinner
          spinnerProps={{
            color: 'twGray.600',
            size: 'xl',
            thickness: '3px',
          }}
        />
      </Box>
    )
  }
  return (
    <>
      <Head>
        <title>Mictodo - Powerful To Do App</title>
        <link rel='icon' href='/icons/icon-48x48.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <main className='pt-24'>
        <Box className='mx-auto w-5/6' mb={44}>
          <h1 data-testid='title' className='text-center text-6xl font-medium font-poppins mb-6'>
            Mictodo
          </h1>
          <h2 className='text-center text-base font-poppins text-gray-600'>
            The drawback of most <span className='font-bold'>To Do</span> applications is the absence of an Activity
            List. Mictodo comes with it 🤟
          </h2>
        </Box>
        {!authorizedUser && (
          <Box textAlign={'center'}>
            <BaseButton
              buttonProps={{
                onClick: handleLogin,
                width: '80%',
              }}
            >
              <FcGoogle className='w-8 h-8 mr-4' />
              <Text fontWeight={'medium'} fontSize={'lg'} fontFamily={'poppins'}>
                Login with Google
              </Text>
            </BaseButton>
          </Box>
        )}
        {authorizedUser && (
          <Box>
            <Box textAlign={'center'} mb={8}>
              <BaseButton
                buttonProps={{
                  onClick: handleRedirectToDashboard,
                  width: '80%',
                }}
              >
                Go to Dashboard
              </BaseButton>
            </Box>
            <Box textAlign={'center'}>
              <BaseButton
                buttonProps={{
                  onClick: handleLogout,
                  width: '80%',
                }}
              >
                Sign out
              </BaseButton>
            </Box>
          </Box>
        )}
      </main>
    </>
  )
}
