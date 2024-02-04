import React from 'react'
import BOQDashboard from '../components/BOQDashboard'
import router from 'next/router'

export default function boqhome() {
    return (

        <div>
            <div className='w-full pl-6'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='text-2xl text-center'>BOQ Head Dashboard</p>
            <BOQDashboard />
        </div>

    )
}
