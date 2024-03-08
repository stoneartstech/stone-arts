import React from 'react'
import BOQDashboard from '../components/BOQHead'
import router from 'next/router'
import BOQHead from '../components/BOQHead'

export default function boqhome() {
    return (

        <div>
            <div className='flex flex-col'>
                <BOQHead />
            </div>
        </div>

    )
}
