import type { AppProps } from 'next/app';
import Head from 'next/head';

import DarkModeToggle from '@/components/DarkmodeToggle';
import Headers from '@/components/Headers/Headers';

import { ProfileProvider } from '../context/ProfileContext';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ProfileProvider>
        <Head>
          <title>wikid</title>
        </Head>
        <DarkModeToggle />
        <Headers />
        <Component {...pageProps} />
      </ProfileProvider>
    </>
  );
}
