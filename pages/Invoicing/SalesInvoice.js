import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/router'

function SalesInvoice() {

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    const router = useRouter()

    return (

        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='mt-2 text-2xl text-center font-bold mb-4'>
                INVOICE
            </p>
            <div className='flex flex-col text-xl gap-4 items-center'>
                <Link href={{
                    pathname: '/Invoicing/UploadInvoice',
                    query: { showroomName: showroomName },
                }}
                    className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                >
                    Upload Invoices
                </Link>
                <Link href={{
                    pathname: '/Invoicing/ViewInvoice',
                    query: { showroomName: showroomName },
                }}
                    className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                >
                    View Invoices
                </Link>
            </div>
        </div>
    )
}

export default SalesInvoice