import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RequestDetails() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const designId = searchParams.get('id')
    const designName = searchParams.get('name')
    const designDescription = searchParams.get('description')
    console.log(designId, designName, designDescription)

    const [loading, setLoading] = useState(false)
    const [request, setRequest] = useState(
        {
            "id": designId,
            "name": designName,
            "description": designDescription,
        }
    )
    const handleCheckDesign = async (designId) => {
        const designData = designs.find(design => design.id === designId);
        window.open(designData.downloadURL)
    }

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
                    Site ID: {designId}
                </div>
                <div className='text-center text-2xl '>
                    Site Name: {designName}
                </div>
                <div className='text-center text-xl'>
                    Description: {designDescription}
                </div>
                {request.downloadURL &&
                    <button
                        onClick={() => handleCheckDesign(design.id)} // Attach onClick event here
                        className='bg-green-400 p-2 rounded-lg text-center'>
                        Check Design
                    </button>
                }
                {/* <div className='text-center text-xl'>
                    Status: {request.status}
                </div> */}
            </div>
        </div>
    }</>
    )
}
