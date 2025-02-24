'use client'

import { useAuthContext } from '@/app/AuthProvider'
import envConfig from '@/config'
import React, { useEffect } from 'react'

const Profile = () => {
  const { sessionToken } = useAuthContext()

  useEffect(() => {
    const fetchRequest = async () => {
      const results = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`
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

      console.log('profile', results)
    }

    fetchRequest()
  }, [sessionToken])

  return <div>Profile</div>
}

export default Profile
