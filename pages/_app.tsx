import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Layout } from '~/src/components/Layout'
import { LayoutContainer } from '~/src/components/LayoutContainer'

const queryClient = new QueryClient()
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <LayoutContainer>
          <Component {...pageProps} />
        </LayoutContainer>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
