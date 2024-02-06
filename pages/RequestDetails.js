import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RequestDetails() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const designId = searchParams.get('id')

    const [loading, setLoading] = useState(false)
    const [request, setRequest] = useState(
        {
            "id": designId,
            "name": "Sample Site Request",
            "description": "Sample Description",
            "status": "Pending"
        }
    )

    return (<>{!loading &&
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col mt-4'>
                <p className='text-2xl mx-auto font-bold'>Information</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                <div className='text-center text-2xl'>
                    Site ID: {request.id}
                </div>
                <div className='text-center text-2xl '>
                    Site Name: {request.name}
                </div>
                <div className='text-center text-xl'>
                    Description: {request.description}
                </div>
                <div className='text-center text-xl'>
                    Status: {request.status}
                </div>
            </div>
        </div>
    }</>
    )
}
