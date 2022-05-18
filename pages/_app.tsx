import '../styles/globals.css'
import { theme } from '~/styles/theme'
import type { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Layout, LayoutContainer } from '~/src/components/v2'
import { ChakraProvider } from '@chakra-ui/provider'
import { Provider } from 'react-redux'
import { store } from '~/src/store'
import { ToastContainer } from '~/src/libs/toast'

const queryClient = new QueryClient()
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Layout>
            <LayoutContainer>
              <Component {...pageProps} />
              <ToastContainer />
            </LayoutContainer>
          </Layout>
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  )
}
