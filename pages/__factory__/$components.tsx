import * as React from 'react'
import * as C from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { TextFieldTaskGroup } from '~/src/components/v2/text-field-task-group'
import { TextFieldTaskItem } from '~/src/components/v2/text-field-task-item'
import { BaseTextarea } from '~/src/components/v2/base-textarea'
import { BaseDrawer } from '~/src/components/v2/base-drawer'
import { TextFieldAddTask } from '~/src/components/v2/text-field-add-task'

export default function FactoryComponentsPage() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = C.useDisclosure()
  const [initiate, setInitiate] = React.useState(false)
  React.useEffect(() => {
    setInitiate(true)
    if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'false') router.push('/404')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'false') return null
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value)
  }
  const handleAddTaskGroup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log(e.currentTarget.value)
    }
  }
  return (
    initiate && (
      <C.VStack py={6} px={6} w='full' spacing={5}>
        <C.Box w='full'>
          <C.Button colorScheme='teal' onClick={onOpen}>
            Open
          </C.Button>
          <BaseDrawer
            rootDrawerProps={{
              isOpen,
              onClose,
            }}
          >
            <C.Text>Hello Drawer</C.Text>
          </BaseDrawer>
        </C.Box>
        <C.Box w='full'>
          <TextFieldTaskGroup
            stackProps={{
              mx: 0,
            }}
            isPriority={false}
          />
        </C.Box>
        <C.Box w='full'>
          <TextFieldTaskItem
            onChangeValue={() => console.log('onChangeValue')}
            textareaProps={{
              onChange: handleTextarea,
            }}
          />
        </C.Box>
        <C.Box w='full'>
          <TextFieldAddTask
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
        </C.Box>
        <C.Box w='full'>
          <BaseTextarea />
        </C.Box>
      </C.VStack>
    )
  )
}
