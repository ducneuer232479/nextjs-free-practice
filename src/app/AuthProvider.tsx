'use client'

import { createContext, useContext, useState } from 'react'

type TAuthProvider = {
  children: React.ReactNode
  initialSessionToken?: string
}

const AuthContext = createContext({
  sessionToken: '',
  setSessionToken: (sessionToken: string) => {}
})

const AuthProvider = ({
  children,
  initialSessionToken = ''
}: TAuthProvider) => {
  const [sessionToken, setSessionToken] = useState(initialSessionToken)

  return (
    <AuthContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AppProvider')
  }

  return context
}

export { AuthProvider, useAuthContext }
