'use client'

import { clientSessionToken } from '@/lib/http'
import React, { useState } from 'react'

const AuthProvider = ({
  children,
  initialSessionToken = ''
}: {
  children: React.ReactNode
  initialSessionToken?: string
}) => {
  useState(() => {
    if (typeof window !== undefined) {
      clientSessionToken.value = initialSessionToken
    }
  })

  return children
}

export { AuthProvider }
