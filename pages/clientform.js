import React, { useState } from 'react'
import { useRouter } from 'next/router'

function clientform() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [option, setOption] = useState('measurement')
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')
    const [aspect, setAspect] = useState('Fireplaces')
    const [sourceInfo, setSourceInfo] = useState('socialmedia')
    const [specificInfo, setSpecificInfo] = useState('')
    const [delivery, setDelivery] = useState('yes')

    const aspects = ['Fireplaces', 'Flooring', 'Sintered Stone']

    const router = useRouter()

    function submitHandler() {
        const route = '/' + option
        console.log(option)
        router.push(route)
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='flex p-12 gap-16 w-full'>

                <div className='flex flex-col w-full'>
                    <p className=''>Name:</p>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Email ID:</p>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Select the Category:</p>
                    <select className='p-2 w-full' onChange={(e) => setOption(e.target.value)}>
                        <option value="measurement">Measurement</option>
                        <option value="retail">Retail</option>
                        <option value="design">Design</option>

                    </select>

                    <p className='mt-4'>Address:</p>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address" className='p-2 w-full' />

                </div>
                <div className='flex flex-col w-full'>
                    <p className='mt-4'>Phone Number:</p>
                    <input type="text" value={number} onChange={(e) => setNumber(e.target.value)}
                        placeholder="+254 1919202020" className=' p-2 w-full ' />

                    <p className='mt-4'>Interested Aspect:</p>
                    <select className='p-2 w-full' onChange={(e) => setAspect(e.target.value)}>
                        {aspects.map((aspect) => (
                            <option value={aspect}>{aspect}</option>
                        ))}
                    </select>

                    <p className='mt-4'>How did you get to know us:</p>
                    <select className='p-2 w-full' onChange={(e) => setSourceInfo(e.target.value)}>
                        <option value="socialmedia">Social Media</option>
                        <option value="website">Website</option>
                        <option value="wordofmouth">Word of mouth</option>
                        <option value="other">Other (Specify)</option>
                    </select>
                    {sourceInfo === 'other' &&
                        <input type="text" value={specificInfo} onChange={(e) => setSpecificInfo(e.target.value)}
                            className='mt-2 p-2 w-full ' />}

                    <p className='mt-4'>Delivery:</p>
                    <select className='p-2 w-full' onChange={(e) => setAspect(e.target.value)}>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
            <button onClick={submitHandler} className='bg-slate-300 hover:bg-slate-400 p-2 w-1/3 '>
                SUBMIT
            </button>
        </div>
    )
}

export default clientform