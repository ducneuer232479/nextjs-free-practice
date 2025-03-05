import { accountApiRequest } from '@/apiRequests/account'
import Profile from '@/app/me/profile'
import ProfileForm from '@/app/me/profile-form'
import { cookies } from 'next/headers'
import React from 'react'

const MeProfile = async () => {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  const results = await accountApiRequest.me(sessionToken?.value ?? '')

  return (
    <div>
      <h1>Profile</h1>
      <p>{results.payload?.data?.email}</p>
      <Profile />
      <ProfileForm profile={results.payload.data} />
    </div>
  )
}

export default MeProfile
