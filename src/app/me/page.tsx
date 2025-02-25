import { accountApiRequest } from '@/apiRequests/account'
import Profile from '@/app/me/profile'
import { cookies } from 'next/headers'
import React from 'react'

const MeProfile = async () => {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  const results = await accountApiRequest.me(sessionToken?.value ?? '')

  console.log('me', results)

  return (
    <div>
      <h1>Profile</h1>
      <p>{results.payload?.data?.email}</p>
      <Profile />
    </div>
  )
}

export default MeProfile
