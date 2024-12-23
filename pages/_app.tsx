import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import DarkModeToggle from '@/components/DarkmodeToggle';
import Headers from '@/components/Headers/Headers';

import { ProfileProvider } from '../context/ProfileContext';

import '@/styles/globals.css';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ProfileProvider>
        <Head>
          <title>wikid</title>
        </Head>
        <DarkModeToggle />
        <Headers />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          {/* NOTE : 배포 시 false로 변경  */}
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ProfileProvider>
    </>
  );
}
