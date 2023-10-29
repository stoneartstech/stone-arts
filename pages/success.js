import React from 'react'

export default function success() {
    return (
        <div className='text-3xl text-center flex flex-col items-center justify-center'>
            Form Submitted Successfully !
            <a href="/" className='bg-slate-300 hover:bg-slate-400 p-2 w-1/3 mt-12'>
                Back to Home
            </a>
        </div>)

}
