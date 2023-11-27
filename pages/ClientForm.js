import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function ClientForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [option, setOption] = useState('measurement')
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')
    const [aspect, setAspect] = useState('Claddings')
    const [sourceInfo, setSourceInfo] = useState('socialmedia')
    const [specificInfo, setSpecificInfo] = useState('')
    const [delivery, setDelivery] = useState('yes')
    const [loading, setLoading] = useState(false)

    const aspects = ['Claddings', 'Travertine', 'Marble', 'Sintered Stones', 'Pavings', 'Fireplaces', 'Facade',
        'Water Features', 'Garden Furnitures', 'Planters and Stands', 'Vanity and Sinks', 'Bird Bath/Feeder',
        'Pebbles and Landscaping', 'Memorials', 'Statues', 'Other Products', 'Brass', 'Plant Venture']

    const router = useRouter()

    async function submitHandler() {

        if (!number || !name || !email || !address || !aspect || !sourceInfo || !delivery || (sourceInfo === 'other' && !specificInfo)) {
            alert('Please enter all the details')
            return
        }

        setLoading(true)
        // const clientId = number
        const clientData = {
            name: name,
            email: email,
            option: option,
            address: address,
            number: number,
            aspect: aspect,
            sourceInfo: sourceInfo,
            specificInfo: specificInfo,
            delivery: delivery
        }

        // await setDoc(doc(db, "clients", clientId), clientData)

        const route = '/' + option


        if (option == 'measurement') {
            setLoading(false)
            router.push({
                pathname: route,
                query: { clientData: JSON.stringify(clientData) }
            })
        }
        else {
            const clientId = clientData.number
            await setDoc(doc(db, "clients", clientId), clientData)
            setLoading(false)
            router.push('/success')
        }

    }

    return <>{!loading && (
        <div className='flex flex-col items-center'>
            <p className='text-3xl'>Client Information Form</p>
            <div className='flex flex-col sm:flex-row p-8 gap-16 w-full'>

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
                            <option key={aspect} value={aspect}>{aspect}</option>
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
        </div>)
    }
    </>

}