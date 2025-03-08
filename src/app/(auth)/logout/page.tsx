'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'
import { authApiRequest } from '@/apiRequests/auth'

const LogoutLogic = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('sessionToken')

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    if (sessionToken === localStorage.getItem('sessionToken')) {
      authApiRequest
        .logoutFromNextClientToNextServer(true, signal)
        .then((res) => router.push(`/login?redirectFrom=${pathname}`))
    }

    return () => {
      controller.abort()
    }
  }, [router, sessionToken, pathname])

  return <div>Logout</div>
}

const LogoutPage = () => (
  <Suspense>
    <LogoutLogic />
  </Suspense>
)

export default LogoutPage
