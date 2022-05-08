import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Head from 'next/head'
import { supabaseClient } from '~/src/libs/supabase-client'
import { useDisclosure, Box, Text } from '@chakra-ui/react'
import { useApiTaskGroup } from '~/src/hooks/use-api-task-group'
import { DrawerTask } from '~/src/components/v2/drawer-task'
import { TextFieldAddTask } from '~/src/components/v2/text-field-add-task'
import { TextFieldTaskGroup } from '~/src/components/v2/text-field-task-group'
import { BaseButton } from '~/src/components/v2/base-button'
import { ProgressSpinner } from '~/src/components/v2/progress-spinner'
import type { TChecklistGroupEntity } from '~/src/types'

const selectAuthorizedUser = async () => await supabaseClient.auth.user()
export default function Dashboard() {
  const router = useRouter()
  const [checklistGroup, setChecklistGroup] = useState<TChecklistGroupEntity | null | undefined>(null)
  const { isOpen: isOpenDrawerTask, onOpen: onOpenDrawerTask, onClose: onCloseDrawerTask } = useDisclosure()
  const { data: authorizedUser, isLoading, isError } = useQuery('authorizedUser', selectAuthorizedUser)
  const { taskGroupEntity, taskGroupMutation } = useApiTaskGroup()

  /**
   *
   * Notes: Handle Page Flow
   *
   */

  if (isLoading || authorizedUser === undefined) {
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
      onOpenDrawerTask()
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
          <Box mt={36} width={'70%'} mx={'auto'}>
            <Text textAlign={'center'}>You do not have access yet, please login first with a Google account.</Text>
          </Box>
          <Box textAlign={'center'} mt={12}>
            <BaseButton
              buttonProps={{
                onClick: handleRedirectToHome,
                width: '80%',
              }}
            >
              Back to Home
            </BaseButton>
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
      <Box pt={8} aria-label='dashboard-container'>
        <Box mx={4} aria-label='activity-title'>
          <Text fontSize={'2xl'} fontWeight={'semibold'}>
            📜 Main Tasks
          </Text>
        </Box>
        <Box pt={8} pb={36} aria-label='task-group-container'>
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
                'data-testid': 'task-group',
              }}
              checkboxProps={{
                colorScheme: 'twGray',
                size: 'lg',
                onChange: (e) => handleUpdateTaskGroupCheckbox(taskGroup.id)(e),
                defaultChecked: taskGroup.is_completed,
                isChecked: taskGroup.is_completed,
                'aria-label': 'task-group-checkbox',
              }}
            >
              {taskGroup.title}
            </TextFieldTaskGroup>
          ))}
        </Box>
        <Box
          aria-label='add-task-group-container'
          display={'flex'}
          justifyContent={'center'}
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
              mx: 4,
              'data-testid': 'text-field-add-task-wrapper',
            }}
            inputProps={{
              colorScheme: 'white',
              autoComplete: 'off',
              className: 'font-poppins',
              focusBorderColor: 'twGray.400',
              size: 'lg',
              onKeyPress: handleAddTaskGroup,
              'data-testid': 'text-field-add-task',
            }}
            placeholder='Add Task-Group'
          />
        </Box>
        <Box aria-label='drawers-container'>
          {checklistGroup && isOpenDrawerTask && (
            <DrawerTask
              taskGroup={checklistGroup}
              isOpen={isOpenDrawerTask}
              onClose={onCloseDrawerTask}
              placement='right'
            />
          )}
        </Box>
      </Box>
    </>
  )
}
