'use client'

import React from 'react'
import ClientHistory from '../components/ClientHistory'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'

export default function clienthistory() {

    const router = useRouter()

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const { logout } = useAuth()
    async function logoutHandler() {
        try {
            await logout()
            router.push('/')
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-12'>
                <p className='my-4 text-3xl text-center'>{showroomName} Showroom</p>
                <button className='bg-red-500 p-3 rounded-lg'
                    onClick={logoutHandler}
                >Logout</button>
            </div>
            <ClientHistory showroomName={showroomName} />
        </div>
    )
}
