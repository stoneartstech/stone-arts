import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function RequestsDisplay() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const param = searchParams.get('param')

    const designPages = [
        { name: "Design Requests from Showrooms", param: "design-requests" },
        { name: "Pending Designs to start", param: "pending-designs" },
        { name: "Ongoing Designs", param: "ongoing-designs" },
        { name: "Pending Approval from Admin", param: "pending-admin-approval" },
        { name: "Pending Approval from Client", param: "pending-client-approval" },
        { name: "Completed Designs", param: "completed-designs" },
    ]
    const page = designPages.find(page => page.param === param)

    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState([
        { name: "Request 1", id: "1" },
        { name: "Request 2", id: "2" },
        { name: "Request 3", id: "3" },
    ])

    return (<>{!loading &&
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col mt-4'>
                <p className='text-2xl mx-auto font-bold'>{page.name}</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {requests.map((request) => (
                    <Link
                        key={request["id"]}
                        href={{
                            pathname: '/RequestDetails',
                            query: { id: request["id"] },
                        }}
                        className='bg-slate-300 p-2 rounded-lg text-center sm:w-1/3'>
                        {request["name"]}
                    </Link>
                ))}
            </div>
        </div>
    }</>
    )
}

export default RequestsDisplay