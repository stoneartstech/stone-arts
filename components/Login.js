import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ClientForm from '@/pages/ClientForm'
import Link from 'next/link'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { login, currentUser } = useAuth()

    async function submitHandler() {
        if (!email || !password) {
            setError('Please enter email and password')
            return
        }
        try {
            await login(email, password)
        }
        catch (err) {
            setError("Failed to login")
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <p className='font-bold text-3xl mb-8'>LOGIN</p>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email" className=' p-2 w-full sm:max-w-[25vw]' />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="password" className=' p-2 w-full sm:max-w-[25vw] my-4' />
            {error && <p className='text-red-500 w-full sm:max-w-[25vw]'>{error}</p>}
            <button onClick={submitHandler} className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>Login</button>
            <p className='my-8 text-xl'>OR</p>
            <Link href="/ClientForm" className='bg-slate-900 hover:bg-slate-700 text-white p-3 w-full w-full sm:max-w-[25vw] text-center'>
                Client Form
            </Link>
        </div>
    )
}

export default Login