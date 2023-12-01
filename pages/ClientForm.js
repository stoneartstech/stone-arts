import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { doc, setDoc, collection, getDocs, onSnapshot } from 'firebase/firestore'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function ClientForm() {

    const [clientId, setClientId] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clientId'), (snapshot) => {
            var number = snapshot.docs[0].data()
            console.log(number)
            setClientId(number.id)
            setLoading(false)
        })

        return fetch
    }, [])

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [option, setOption] = useState('measurement')
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')
    const [aspect, setAspect] = useState('Claddings')
    const [sourceInfo, setSourceInfo] = useState('socialmedia')
    const [specificInfo, setSpecificInfo] = useState('')
    const [delivery, setDelivery] = useState('yes')

    const aspects = ['Claddings', 'Travertine', 'Marble', 'Sintered Stones', 'Pavings', 'Fireplaces', 'Facade',
        'Water Features', 'Garden Furnitures', 'Planters and Stands', 'Vanity and Sinks', 'Bird Bath/Feeder',
        'Pebbles and Landscaping', 'Memorials', 'Statues', 'Other Products', 'Brass', 'Plant Venture']



    const [validNumber, setValidNumber] = useState(true)
    const validateNumber = (number) => {
        console.log(number)
        var numberPattern = /^\d{1,14}$/
        if (number.startsWith('254')) {
            numberPattern = /^\d{12}$/
        }
        return numberPattern.test(number)
    }

    const router = useRouter()

    async function submitHandler() {

        if (!number || !name || !email || !address || !aspect || !sourceInfo || !delivery || (sourceInfo === 'other' && !specificInfo)) {
            alert('Please enter all the details')
            return
        }

        setLoading(true)

        var today = new Date()
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

        const clientData = {
            clientId: clientId,
            name: name,
            email: email,
            option: option,
            address: address,
            date: date,
            number: '+' + number,
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
            await setDoc(doc(db, "clients", clientId.toString()), clientData)
            await setDoc(doc(db, "clientId", "clientId"), { id: clientId + 1 })
            setLoading(false)
            router.push('/success')
        }

    }

    return <>{!loading && (
        <div className='flex flex-col items-center'>
            <p className='text-3xl'>Client Information Form</p>
            <p>ID:{clientId}</p>
            <div className='flex flex-col sm:flex-row p-8 gap-16 w-full'>

                <div className='flex flex-col w-full'>
                    <p className=''>Name:<span className='text-red-500'>*</span></p>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Email ID:<span className='text-red-500'>*</span></p>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Select the Category:</p>
                    <select className='p-2 w-full' onChange={(e) => setOption(e.target.value)}>
                        <option value="measurement">Measurement</option>
                        <option value="retail">Retail</option>
                        <option value="design">Design</option>

                    </select>

                    <p className='mt-4'>Address:<span className='text-red-500'>*</span></p>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address" className='p-2 w-full' />

                </div>
                <div className='flex flex-col w-full'>
                    <p className='mt-1'>Phone Number:<span className='text-red-500'>*</span></p>
                    <PhoneInput
                        country={'ke'}
                        inputProps={{
                            required: true,
                        }}
                        en
                        placeholder='Enter phone number'
                        value={number} onChange={(value) => {
                            setNumber(value)
                            setValidNumber(validateNumber(value))
                        }}
                        className='w-full' />
                    {!validNumber && <p className='text-red-500'>Please enter a valid phone number</p>}

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