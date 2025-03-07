import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import localFont from 'next/font/local'

import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { cookies } from 'next/headers'
import AppProvider from '@/app/app-provider'
import SlideSession from '@/components/slide-session'
import { accountApiRequest } from '@/apiRequests/account'

// const roboto = Roboto({ subsets: ['vietnamese'], weight: ['100', '300'] })

const inter = Inter({ subsets: ['vietnamese'] })

// const myFont = localFont({
//   src: [
//     {
//       path: './Roboto-Thin.ttf',
//       weight: '100'
//     },
//     {
//       path: './Roboto-Regular.ttf',
//       weight: '400'
//     }
//   ],
//   display: 'swap',
//   variable: '--font-roboto'
// })

export const metadata: Metadata = {
  title: {
    template: '%s | Productic',
    default: 'Productic'
  },
  description: 'Được tạo bởi Đức Dev'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  let user = null

  if (sessionToken) {
    const data = await accountApiRequest.me(sessionToken.value)
    user = data.payload.data
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Toaster />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider initialSessionToken={sessionToken?.value} user={user}>
            <Header user={user} />
            {children}
            <SlideSession />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
