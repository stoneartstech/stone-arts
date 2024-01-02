import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'
import TimePicker from 'react-time-picker'
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function measurement() {
    /* eslint-disable */
    const [cost, setCost] = useState('')
    const [date, setDate] = useState('')
    const [supplyFix, setSupplyFix] = useState('supply')
    const [time, setTime] = useState('14:00')
    const [contactPerson, setContactPerson] = useState('')
    const [loading, setLoading] = useState(false)


    const router = useRouter()
    const query = useSearchParams().get("clientData")
    const showroomName = useSearchParams().get("showroomName")
    const [clientData, setClientData] = useState(JSON.parse(query))

    const showroomDbNames = {
        "Galleria": "clients",
        "Mirage": "mirage-clients",
        "Kisumu": "kisumu-clients",
        "Mombasa Road": "mombasa-clients",
    }
    const showroomDbName = showroomDbNames[showroomName]

    async function submitHandler() {
        if (!cost || !date || !time || !supplyFix || !contactPerson) {
            alert('Please enter all the details')
            return
        }
        setLoading(true)

        const measurementData = {
            cost: cost,
            date: date,
            supplyFix: supplyFix,
            time: time,
            contactPerson: contactPerson
        }

        // setClientData({ ...clientData, measurementInfo: measurementData })
        clientData["measurementData"] = measurementData;
        // console.log(clientData)
        const clientId = clientData.clientId

        await setDoc(doc(db, showroomDbName, clientId.toString()), clientData)
        await setDoc(doc(db, "clientId", "clientId"), { id: clientId + 1 })
        setLoading(false)
        router.push('/success')
    }
    return <> {!loading && (
        <div className='flex flex-col items-center'>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='text-3xl'>Measurement Information</p>
            <p className='text-xl mt-4'>Measurement Charges : KES 10,000/-</p>
            <p className=''>Outside Nairobi, prices may vary *T&C Apply*</p>
            <div className='flex flex-col sm:flex-row p-8 gap-16 w-full'>
                <div className='flex flex-col w-full'>

                    <div className='flex items-center'>
                        <p className='mr-8'>Cost:<span className='text-red-500'>*</span></p>
                        <p className='mr-2'>KES</p>
                        <input type="number" value={cost} onChange={(e) => setCost(e.target.value)}
                            className=' p-2 ' />
                    </div>


                    <p className='mt-4'>Date for site visit:<span className='text-red-500'>*</span></p>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className=' p-2 w-full ' />


                    <p className='mt-4'>Supply/Supply and Fix:<span className='text-red-500'>*</span></p>
                    <select className='p-2 w-full' onChange={(e) => setSupplyFix(e.target.value)}>
                        <option value="supply">Supply</option>
                        <option value="supplyfix">Supply and Fix</option>
                        <option value="later">To be decided later</option>

                    </select>

                </div>
                <div className='flex flex-col w-full'>
                    <p className='mt-4'>Time for the visit: (Type in 24H format)<span className='text-red-500'>*</span></p>
                    <TimePicker value={time} onChange={setTime} />

                    <p className='mt-4'>Contact person at site:<span className='text-red-500'>*</span></p>
                    <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
                        className=' p-2 w-full ' />
                </div>
            </div>
            <button onClick={submitHandler} className='bg-slate-300 hover:bg-slate-400 p-2 w-1/3 '>
                SUBMIT
            </button>
        </div>)
    }
    </>
    /* eslint-enable */
}
