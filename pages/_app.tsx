import '../styles/globals.css'
import { theme } from '~/styles/theme'
import type { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'
import { Layout } from '~/src/components/layout'
import { LayoutContainer } from '~/src/components/layout-container'
import { ChakraProvider } from '@chakra-ui/provider'
import { Provider } from 'react-redux'
import { store } from '~/src/store'

const queryClient = new QueryClient()
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Layout>
            <LayoutContainer>
              <Component {...pageProps} />
            </LayoutContainer>
          </Layout>
        </ChakraProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </Provider>
    </QueryClientProvider>
  )
}
