import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ClientForm from '@/pages/ClientForm'
import Link from 'next/link'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { login, currentUser } = useAuth()

    async function submitHandler() {
        if (!username || !password) {
            setError('Please enter username and password')
            return
        }
        try {
            const email = username.toLowerCase().replace(/\s/g, '') + '@stonearts.com'
            await login(email, password)
        }
        catch (err) {
            console.log(username)
            setError("Failed to login")
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <p className='font-bold text-3xl mb-8'>LOGIN</p>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="username" className=' p-2 w-full sm:max-w-[25vw]' />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="password" className=' p-2 w-full sm:max-w-[25vw] my-4' />
            {error && <p className='text-red-500 w-full sm:max-w-[25vw]'>{error}</p>}
            <button onClick={submitHandler} className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>Login</button>
            {/* <p className='my-8 text-xl'>OR</p>
            <Link href="/ClientForm" className='bg-slate-900 hover:bg-slate-700 text-white p-3 w-full sm:max-w-[25vw] text-center'>
                Client Form
            </Link> */}
        </div>
    )
}

export default Login