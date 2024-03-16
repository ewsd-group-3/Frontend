import DialogCenter from '@/components/shared/DialogCenter'
import RecoilStatePortal from '@/lib/RecoilStatePortal'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sidebar from '@/components/Sidebar/side-bar'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <main className={poppins.className}>
          <Sidebar>
            <GlobalComponent />
            <Component {...pageProps} />
          </Sidebar>
        </main>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  )
}

const GlobalComponent = () => (
  <div>
    <RecoilStatePortal />
    <DialogCenter />
  </div>
)
