'use client'

import React, { createContext, useContext, useState } from 'react'
import { clientSessionToken } from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'

type User = AccountResType['data']

const AppContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
}>({
  user: null,
  setUser: () => {}
})

const AppProvider = ({
  children,
  initialSessionToken = '',
  user: userProps
}: {
  children: React.ReactNode
  initialSessionToken?: string
  user: User | null
}) => {
  const [user, setUser] = useState<User | null>(userProps)

  useState(() => {
    if (typeof window !== 'undefined') {
      clientSessionToken.value = initialSessionToken
    }
  })

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}

export default AppProvider
