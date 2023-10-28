import React from 'react'
import Image from 'next/image'

function Header() {
    return (
        <div className='fixed top-0 w-full left-0 bg-slate-300 p-4 flex items-center'>
            <Image
                src="/logo.png"
                alt="Stone Arts Logo"
                width={150}
                height={150}
            />
            <p className='text-4xl text-center w-full'>Stone Arts</p>
        </div>
    )
}

export default Header