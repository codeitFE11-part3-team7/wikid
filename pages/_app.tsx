import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import DarkModeToggle from '@/components/DarkmodeToggle';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DarkModeToggle />
      <Component {...pageProps} />
    </>
  );
}
