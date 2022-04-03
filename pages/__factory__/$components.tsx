import * as React from 'react'
import * as C from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { TextFieldTaskGroup } from '~/src/components/v2/text-field-task-group'
import { TextFieldTaskItem } from '~/src/components/v2/text-field-task-item'
import { DrawerBase } from '~/src/components/v2/drawer-base'

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
  return (
    initiate && (
      <C.VStack py={6} px={6} w='full' spacing={5}>
        <C.Box w='full'>
          <C.Button colorScheme='teal' onClick={onOpen}>
            Open
          </C.Button>
          <DrawerBase
            rootDrawerProps={{
              isOpen,
              onClose,
            }}
          >
            <C.Text>Hello Drawer</C.Text>
          </DrawerBase>
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
          <TextFieldTaskItem />
        </C.Box>
      </C.VStack>
    )
  )
}
