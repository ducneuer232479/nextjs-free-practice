import Profile from '@/app/me/profile'
import envConfig from '@/config'
import { cookies } from 'next/headers'
import React from 'react'

const MeProfile = async () => {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  const results = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bear ${sessionToken?.value}`
      }
    }
  ).then(async (res) => {
    const payload = await res.json()

    const data = {
      status: res.status,
      payload
    }

    if (!res.ok) {
      throw data
    }

    return data
  })

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
