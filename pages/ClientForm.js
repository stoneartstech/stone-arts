import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { doc, setDoc, collection, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useSearchParams } from 'next/navigation'
import Select from 'react-select'

export default function ClientForm() {

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    const showroomDbNames = {
        "Galleria": "clients",
        "Mirage": "mirage-clients",
        "Kisumu": "kisumu-clients",
        "Mombasa Road": "mombasa-clients",
    }
    const showroomDbName = showroomDbNames[showroomName]

    const [clientId, setClientId] = useState()
    const [loading, setLoading] = useState(false)
    const [clientCode, setClientCode] = useState('')

    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clientId'), (snapshot) => {
            var number = snapshot.docs[0].data()
            setClientId(number.id)
            setClientCode(number.id)
        })
        return fetch
    }
        , [])


    var today = new Date()
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [options, setOptions] = useState([])
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')
    const [aspects, setAspects] = useState([])
    const [sourceInfo, setSourceInfo] = useState('social media')
    const [specificInfo, setSpecificInfo] = useState('')
    const [salesPerson, setSalesPerson] = useState('')


    const [repeatClient, setRepeatClient] = useState(false)
    // const [delivery, setDelivery] = useState('yes')

    const aspectsList = ['Claddings', 'Travertine', 'Marble', 'Sintered Stones', 'Pavings', 'Fireplaces', 'Facade',
        'Water Features', 'Garden Furnitures', 'Planters and Stands', 'Vanity and Sinks', 'Bird Bath/Feeder',
        'Pebbles and Landscaping', 'Memorials', 'Statues', 'Brass', 'Plant Venture', 'Other Products']

    const aspectsFinalList = aspectsList.map((aspect) => ({
        value: aspect,
        label: aspect,
    }));
    const handleSelectChange = (selectedOptions) => {
        setAspects(selectedOptions.map((option) => option.value));
    };

    const optionList = ['retail', 'design', 'measurement', 'visiting']
    const optionFinalList = optionList.map((option) => ({
        value: option,
        label: option,
    }));
    const handleOptionChange = (selectedOptions) => {
        setOptions(selectedOptions.map((option) => option.value));
    }

    const [validNumber, setValidNumber] = useState(true)
    const validateNumber = (number) => {
        console.log(number)
        var numberPattern = /^\d{1,14}$/
        if (number.startsWith('254')) {
            numberPattern = /^\d{12}$/
        }
        if (number.startsWith('44')) {
            numberPattern = /^\d{13}$/
        }
        if (number.startsWith('1')) {
            numberPattern = /^\d{11}$/
        }
        return numberPattern.test(number)
    }

    const router = useRouter()

    async function checkClient() {
        //check if number exists in any client's data  from firebase
        const q = query(collection(db, showroomDbName), where("number", "==", '+' + number))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.size > 0) {
            //fetch the client's data and set it to the respective states
            const client = querySnapshot.docs[0].data()
            setName(client.name)
            if (client.lastname) setLastname(client.lastname)
            setEmail(client.email)
            setAddress(client.address)
            setSourceInfo(client.sourceInfo)
            setSpecificInfo(client.specificInfo)
            setClientCode(client.clientCode)
            setRepeatClient(true)
            return
        }
        else {
            setRepeatClient(false)
        }
    }

    async function checkClientEmail() {
        //check if email exists in any client's data  from firebase
        const q = query(collection(db, showroomDbName), where("email", "==", email))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.size > 0) {
            //fetch the client's data and set it to the respective states
            const client = querySnapshot.docs[0].data()
            setName(client.name)
            if (client.lastname) setLastname(client.lastname)
            setNumber(client.number)
            setAddress(client.address)
            setSourceInfo(client.sourceInfo)
            setSpecificInfo(client.specificInfo)
            setClientCode(client.clientCode)
            setRepeatClient(true)
            return
        }
        else {
            setRepeatClient(false)
        }
    }

    async function submitHandler() {
        if (!number || !name || !lastname || !salesPerson || !address || !options || !sourceInfo || (sourceInfo === 'other' && !specificInfo)) {
            alert('Please enter all the details')
            setLoading(false)
            return
        }

        // const fetch = onSnapshot(collection(db, 'clientId'), (snapshot) => {
        //     var number = snapshot.docs[0].data()
        //     setClientId(number.id)
        //     setClientCode(number.id)
        // })

        // await fetch()


        checkClient()
        if (!repeatClient) checkClientEmail()

        setLoading(true)

        const clientData = {
            clientId: clientId,
            name: name,
            lastname: lastname,
            email: email,
            salesPerson: salesPerson,
            option: options.join(', '),
            address: address,
            date: date,
            number: '+' + number,
            aspects: aspects,
            sourceInfo: sourceInfo,
            specificInfo: specificInfo,
            clientCode: clientCode
        }

        // await setDoc(doc(db, "clients", clientId), clientData)

        if (options.includes('measurement')) {
            setLoading(false)
            router.push({
                pathname: "/measurement",
                query: {
                    clientData: JSON.stringify(clientData),
                    showroomName: showroomName
                }
            })
        }
        else {
            await setDoc(doc(db, showroomDbName, clientId.toString()), clientData)
            await setDoc(doc(db, "clientId", "clientId"), { id: clientId + 1 })
            setLoading(false)
            router.push('/success')
        }
        setLoading(false)

    }

    return <>{!loading && (
        <div className='flex flex-col items-center'>
            <p className='text-3xl'>Client Information Form</p>
            <div className='flex flex-col sm:flex-row p-8 gap-16 w-full'>

                <div className='flex flex-col w-full'>
                    <p className=''>First Name:<span className='text-red-500'>*</span></p>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className=''>Last Name:<span className='text-red-500'>*</span></p>
                    <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Email ID:</p>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                        className=' p-2 w-full ' />
                    <button onClick={checkClientEmail} className='bg-slate-300 hover:bg-slate-400 p-1 w-48'>
                        Check(recurring client)
                    </button>



                    <p className='mt-4'>Select the Category:</p>
                    <Select
                        options={optionFinalList}
                        isMulti
                        value={optionFinalList.filter((option) => options.includes(option.value))}
                        onChange={handleOptionChange}
                        className='w-full'
                    />

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
                        options={aspectsFinalList}
                        isMulti
                        value={aspectsFinalList.filter((option) => aspects.includes(option.value))}
                        onChange={handleSelectChange}
                        className='w-full'
                    />
                    <p className='mt-4'>How did you get to know us:</p>
                    <select className='p-2 w-full' onChange={(e) => setSourceInfo(e.target.value)}>
                        <option value="social media">Social Media</option>
                        <option value="website">Website</option>
                        <option value="word of mouth">Word of mouth</option>
                        <option value="walk in">Walk In</option>
                        <option value="repeat">Repeat</option>
                        <option value="other">Other (Specify)</option>
                    </select>
                    {sourceInfo === 'other' || sourceInfo == 'repeat' &&
                        <input type="text" placeholder="Specify" value={specificInfo} onChange={(e) => setSpecificInfo(e.target.value)}
                            className='mt-2 p-2 w-full ' />}

                    <p className='mt-4'>Sales Person:<span className='text-red-500'>*</span></p>
                    <input type="text" value={salesPerson} onChange={(e) => setSalesPerson(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Date:</p>
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