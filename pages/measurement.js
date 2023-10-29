import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'

export default function measurement() {
    const [cost, setCost] = useState('')
    const [date, setDate] = useState('')
    const [supplyFix, setSupplyFix] = useState('supply')
    const [time, setTime] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [loading, setLoading] = useState(false)

    const aspects = ['Fireplaces', 'Flooring', 'Sintered Stone']

    const router = useRouter()
    const query = useSearchParams().get("clientData")
    const [clientData, setClientData] = useState(JSON.parse(query))

    async function submitHandler() {
        if (!cost || !date || !time || !contactPerson) {
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
        const clientId = clientData.number

        await setDoc(doc(db, "clients", clientId), clientData)
        setLoading(false)
        router.push('/success')
    }
    return <> {!loading && (
        <div className='flex flex-col items-center'>
            <p className='text-3xl'>Measurement Information</p>
            <p className='text-xl mt-4'>Measurement Charges : 10,000/-</p>
            <p className=''>Outside Nairobi, prices may vary *T&C Apply*</p>
            <div className='flex p-8 gap-16 w-full'>
                <div className='flex flex-col w-full'>
                    <p className=''>Cost:</p>
                    <input type="text" value={cost} onChange={(e) => setCost(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Date for site visit:</p>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className=' p-2 w-full ' />


                    <p className='mt-4'>Supply/Supply and Fix:</p>
                    <select className='p-2 w-full' onChange={(e) => setSupplyFix(e.target.value)}>
                        <option value="supply">Supply</option>
                        <option value="supplyfix">Supply and Fix</option>
                        <option value="later">To be decided later</option>

                    </select>

                </div>
                <div className='flex flex-col w-full'>
                    <p className='mt-4'>Time for the visit:</p>
                    <input type="text" value={time} onChange={(e) => setTime(e.target.value)}
                        className=' p-2 w-full ' />

                    <p className='mt-4'>Contact person at site:</p>
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
}
