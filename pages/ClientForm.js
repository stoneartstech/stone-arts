import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { doc, setDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useSearchParams } from 'next/navigation'
import Select from 'react-select'

export default function ClientForm() {

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const [clientId, setClientId] = useState()
    const [loading, setLoading] = useState(true)
    const [clientCode, setClientCode] = useState('')
    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clientId'), (snapshot) => {
            var number = snapshot.docs[0].data()
            setClientId(number.id)
            setClientCode(number.id)
            setLoading(false)
        })

        return fetch
    }, [])

    var today = new Date()
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [option, setOption] = useState('measurement')
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')
    const [aspects, setAspects] = useState([])
    const [sourceInfo, setSourceInfo] = useState('social media')
    const [specificInfo, setSpecificInfo] = useState('')


    const [repeatClient, setRepeatClient] = useState(false)
    // const [delivery, setDelivery] = useState('yes')

    const aspectsList = ['Claddings', 'Travertine', 'Marble', 'Sintered Stones', 'Pavings', 'Fireplaces', 'Facade',
        'Water Features', 'Garden Furnitures', 'Planters and Stands', 'Vanity and Sinks', 'Bird Bath/Feeder',
        'Pebbles and Landscaping', 'Memorials', 'Statues', 'Brass', 'Plant Venture', 'Other Products']

    const optionsList = aspectsList.map((aspect) => ({
        value: aspect,
        label: aspect,
    }));
    const handleSelectChange = (selectedOptions) => {
        setAspects(selectedOptions.map((option) => option.value));
    };

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

    async function checkClient() {
        //check if number exists in any client's data  from firebase
        const q = query(collection(db, "clients"), where("number", "==", '+' + number))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.size > 0) {
            alert('Repeating client')
            //fetch the client's data and set it to the respective states
            const client = querySnapshot.docs[0].data()
            setName(client.name)
            setEmail(client.email)
            setOption(client.option)
            setAddress(client.address)
            setAspects(client.aspects)
            setSourceInfo(client.sourceInfo)
            setSpecificInfo(client.specificInfo)
            setClientCode(client.clientCode)
            setRepeatClient(true)
            return
        }
        else {
            alert('New client')
            setRepeatClient(false)
        }
    }

    async function submitHandler() {

        if (!number || !name || !email || !address || !aspects || !sourceInfo || (sourceInfo === 'other' && !specificInfo)) {
            alert('Please enter all the details')
            return
        }

        setLoading(true)

        const clientData = {
            clientId: clientId,
            name: name,
            email: email,
            option: option,
            address: address,
            date: date,
            number: '+' + number,
            aspects: aspects,
            sourceInfo: sourceInfo,
            specificInfo: specificInfo,
            showroom: showroomName,
            clientCode: clientCode
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
                    <button onClick={checkClient} className='bg-slate-300 hover:bg-slate-400 p-1 w-48'>
                        Check(recurring client)
                    </button>

                    <p className='mt-4'>Interested Aspect:</p>
                    <Select
                        options={optionsList}
                        isMulti
                        value={optionsList.filter((option) => aspects.includes(option.value))}
                        onChange={handleSelectChange}
                        className='w-full'
                    />
                    <p className='mt-4'>How did you get to know us:</p>
                    <select className='p-2 w-full' onChange={(e) => setSourceInfo(e.target.value)}>
                        <option value="social media">Social Media</option>
                        <option value="website">Website</option>
                        <option value="word of mouth">Word of mouth</option>
                        <option value="other">Other (Specify)</option>
                    </select>
                    {sourceInfo === 'other' &&
                        <input type="text" value={specificInfo} onChange={(e) => setSpecificInfo(e.target.value)}
                            className='mt-2 p-2 w-full ' />}

                    <p className='mt-4'>Delivery:</p>
                    {/* <select className='p-2 w-full' onChange={(e) => setAspect(e.target.value)}>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select> */}
                    <p>{date}</p>
                </div>
            </div>
            <button onClick={submitHandler} className='bg-slate-300 hover:bg-slate-400 p-2 w-1/3 '>
                SUBMIT
            </button>
        </div>)
    }
    </>

}