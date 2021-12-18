import { AppProps } from 'next/app' //Passando tipagem do props
import { Header } from '../components/Header'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
