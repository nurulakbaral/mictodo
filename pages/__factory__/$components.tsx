import * as React from 'react'
import * as C from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { TextFieldTaskGroup } from '~/src/components/v2/text-field-task-group'
import { DrawerBase } from '~/src/components/v2/drawer-base'

export default function FactoryComponentsPage() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = C.useDisclosure()
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'false') router.push('/404')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'false') return null
  return (
    <C.Box py={6} px={3}>
      <C.Box>
        <C.Button colorScheme='teal' onClick={onOpen}>
          Open
        </C.Button>
        {isOpen && (
          <DrawerBase
            rootDrawerProps={{
              isOpen,
              onClose,
            }}
          >
            <C.Text>Hello Drawer</C.Text>
          </DrawerBase>
        )}
      </C.Box>
    </C.Box>
  )
}
