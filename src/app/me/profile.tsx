'use client'

import { accountApiRequest } from '@/apiRequests/account'
import React, { useEffect } from 'react'

const Profile = () => {
  useEffect(() => {
    const fetchRequest = async () => {
      const results = await accountApiRequest.meClient()
      console.log('profile', results)
    }
    fetchRequest()
  }, [])

  return <div>Profile</div>
}

export default Profile
