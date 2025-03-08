'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AccountResType } from '@/schemaValidations/account.schema'

type User = AccountResType['data']

const AppContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false
})

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const isAuthenticated = Boolean(user)

  const setUser = (user: User | null) => {
    setUserState(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  useEffect(() => {
    const _user = localStorage.getItem('user')
    setUserState(_user ? JSON.parse(_user) : null)
  }, [])

  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated }}>
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
