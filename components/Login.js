import React, { useState } from 'react'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    function submitHandler() {
        if (!username || !password) {
            setError('Please enter username and password')
            return
        }
        if (username === 'pankaj' && password === '1234') {
            window.location.href = '/admin'
            return
        }
        else {
            setError('Invalid username or password')
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <p className='font-bold text-3xl mb-8'>LOGIN</p>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="username" className=' p-2 w-full max-w-[25vw]' />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="password" className=' p-2 w-full max-w-[25vw] my-4' />
            {error && <p className='text-red-500 w-full max-w-[25vw]'>{error}</p>}
            <button onClick={submitHandler} className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>Login</button>
            <p className='my-8 text-xl'>OR</p>
            <button className='bg-slate-900 hover:bg-slate-700 text-white p-2 w-full max-w-[25vw]'>
                Client Form
            </button>
        </div>
    )
}

export default Login