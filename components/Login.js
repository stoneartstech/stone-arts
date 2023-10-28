import React from 'react'

function Login() {
    return (
        <div className='flex flex-col justify-center items-center'>
            <p className='font-bold text-3xl mb-8'>LOGIN</p>
            <input type="text" placeholder="username" className=' p-2 w-full max-w-[25vw]' />
            <input type="password" placeholder="password" className=' p-2 w-full max-w-[25vw] my-4' />
            <button className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>Login</button>
            <p className='my-8 text-xl'>OR</p>
            <button className='bg-slate-900 hover:bg-slate-700 text-white p-2 w-full max-w-[25vw]'>Client Form</button>



        </div>
    )
}

export default Login