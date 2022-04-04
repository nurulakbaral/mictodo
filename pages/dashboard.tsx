import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { supabaseClient } from '~/src/libs/supabase-client'
import { ProgressCircular } from '~/src/components/progress-circular'
import Head from 'next/head'
import { useDisclosure, Box, Text } from '@chakra-ui/react'
import { ButtonBase } from '~/src/components/button-base'
import type { TChecklistGroupEntity } from '~/src/types'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'
import { DrawerTask } from '~/src/components/v2/drawer-task'
import { TextFieldAddTask } from '~/src/components/v2/text-field-add-task'
import { TextFieldTaskGroup } from '~/src/components/v2/text-field-task-group'

const selectAuthorizedUser = async () => await supabaseClient.auth.user()
export default function Dashboard() {
  const router = useRouter()
  const [checklistGroup, setChecklistGroup] = useState<TChecklistGroupEntity | null | undefined>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: authorizedUser, isLoading, isError } = useQuery('authorizedUser', selectAuthorizedUser)
  const { taskGroupEntity, taskGroupMutation } = useApiTaskGroup()

  /**
   *
   * Notes: Handle Page Flow
   *
   */

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

  /**
   *
   * Notes: Task Group Cases
   *
   */

  const handleAddTaskGroup = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = e.currentTarget.value
      if (inputValue === '') {
        alert('Please enter a task')
        return
      }
      taskGroupMutation.mutate({
        user_id: authorizedUser?.id,
        title: inputValue,
        $options: { verb: 'INSERT' },
      })
    }
  }
  const handleUpdateTaskGroupCheckbox = (id: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      taskGroupMutation.mutate({
        id,
        is_completed: e.currentTarget.checked,
        $options: { verb: 'UPDATE' },
      })
    }
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
            <TextFieldTaskGroup
              stackProps={{
                _hover: {
                  bg: 'twGray.100',
                },
                mb: 2,
              }}
              key={taskGroup.id}
              isPriority={false}
              boxFieldProps={{
                onClick: handleShowDetailTaskGroup(taskGroup),
              }}
              checkboxProps={{
                colorScheme: 'twGray',
                size: 'lg',
                onChange: (e) => handleUpdateTaskGroupCheckbox(taskGroup.id)(e),
                defaultChecked: taskGroup.is_completed,
              }}
            >
              {taskGroup.title}
            </TextFieldTaskGroup>
          ))}
        </Box>
        <Box
          bgColor={'white'}
          position={'fixed'}
          bottom={0}
          left={0}
          right={0}
          zIndex={1}
          pt={6}
          pb={12}
          borderTop={'1px solid #eaeaea'}
        >
          <TextFieldAddTask
            boxProps={{
              w: 'lg',
              margin: 'auto',
            }}
            inputProps={{
              colorScheme: 'white',
              autoComplete: 'off',
              className: 'font-poppins',
              focusBorderColor: 'twGray.400',
              size: 'lg',
              onKeyPress: handleAddTaskGroup,
            }}
            placeholder='Add Task'
          />
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
