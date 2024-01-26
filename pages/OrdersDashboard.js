import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

export default function OrdersDashboard() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const router = useRouter()
    return (
        <div>
            <div className='w-full pl-6'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col items-center'>
                <p className='text-3xl'>Orders</p>
            </div>
            <div className='flex flex-col gap-4 mx-auto justify-center items-center mt-4'>
                <Link href={{
                    pathname: '/UploadOrder',
                    query: { showroomName: showroomName },
                }}
                    className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                >
                    Create Order
                </Link>
                <Link href={{
                    pathname: '/OrderHistory',
                    query: { showroomName: showroomName },
                }}
                    className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                >
                    Order History
                </Link>
            </div>

        </div>
    )
}
