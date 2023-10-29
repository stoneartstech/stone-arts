import React from 'react'
import Link from 'next/link'

export default function success() {
    return (
        <div className='text-3xl text-center flex flex-col items-center justify-center'>
            Information sent to BOQ Successfully !
            <Link href="/" className='bg-slate-300 hover:bg-slate-400 p-2 w-1/3 mt-12'>
                Back to Home
            </Link>
        </div>)

}
