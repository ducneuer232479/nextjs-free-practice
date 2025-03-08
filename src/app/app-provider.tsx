'use client'

import React, { createContext, useContext, useState } from 'react'
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
  user: userProps
}: {
  children: React.ReactNode
  user: User | null
}) => {
  const [user, setUser] = useState<User | null>(userProps)

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
