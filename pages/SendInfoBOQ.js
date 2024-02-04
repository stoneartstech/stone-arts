import React, { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'


function SendInfoBOQ() {

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const [loading, setLoading] = useState(true)

    const [clientRequests, setClientRequests] = useState([])
    const [originalClientRequests, setOriginalClientRequests] = useState([])

    const showroomDbNames = {
        "Galleria": "clients",
        "Mirage": "mirage-clients",
        "Kisumu": "kisumu-clients",
        "Mombasa Road": "mombasa-clients",
    }
    const showroomDbName = showroomDbNames[showroomName]

    const router = useRouter()

    useEffect(() => {
        const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
            var requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            requests = requests.filter((clientRequest) => clientRequest.option === 'measurement')
            requests.forEach((clientRequest) => {
                clientRequest.aspects = clientRequest.aspects.join(',')
                clientRequest.date = clientRequest.date
            })
            setClientRequests(requests)
            setOriginalClientRequests(requests)
            setLoading(false)
        })

        return fetch
    }, [])

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }

    function handleSearch() {
        setClientRequests(originalClientRequests.filter((clientRequest) => {
            var searchParam = search.toLowerCase()
            return (clientRequest.name.toLowerCase().includes(searchParam)
                || clientRequest.clientCode.toString().includes(searchParam)
                || clientRequest.clientId.toString().includes(searchParam)
                || clientRequest.email.toLowerCase().includes(searchParam)
                || clientRequest.number.toString().includes(searchParam)
                || clientRequest.address.toLowerCase().includes(searchParam)
                || clientRequest.aspects.toLowerCase().includes(searchParam)
                || clientRequest.option.toLowerCase().includes(searchParam)
                || clientRequest.sourceInfo.toLowerCase().includes(searchParam)
                || clientRequest.salesPerson.toLowerCase().includes(searchParam)
                || clientRequest.measurementData.contactPerson.toLowerCase().includes(searchParam)
                || clientRequest.measurementData.time.toLowerCase().includes(searchParam)
            )
        }
        ))
    }

    function parseDateString(dateString) {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function parseDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function handleDateSearch() {
        if (startDate && endDate) {
            if (parseDate(startDate) > parseDate(endDate)) {
                alert('End date should be greater than start date');
                return;
            }
        }
        setClientRequests(originalClientRequests.filter((clientRequest) => {
            const requestDate = parseDateString(clientRequest.date);
            const visitDate = parseDateString(clientRequest.measurementData.date);
            const check1 = ((requestDate >= parseDate(startDate) || !startDate) &&
                (requestDate <= new parseDate(endDate) || !endDate))
            const check2 = ((visitDate >= parseDate(startDate) || !startDate) &&
                (visitDate <= parseDate(endDate) || !endDate))
            return (check1 || check2)
        }
        ))
    }

    const handleSendInfo = async (clientId) => {
        try {
            const clientRequest = originalClientRequests.find((request) => request.clientId === clientId);
            await setDoc(doc(db, 'boq', clientId.toString()), clientRequest)
            alert('Info sent to BOQ')
        }
        catch (error) {
            console.log(error)
            alert('Error sending info to BOQ')
        }

    }
    const handleDeleteRequest = (clientId) => {
        // Delete request
    }
    const handleCheckInfo = (clientId) => {
        const clientRequest = originalClientRequests.find((request) => request.clientId === clientId);
        alert(`Full Name: ${clientRequest.name} ${clientRequest.lastname}
        \nClient Code: ${clientRequest.clientId}
        \nPhone Number: ${clientRequest.phoneNumber}
        \nEmail: ${clientRequest.email}
        \nAddress: ${clientRequest.address}
        \nDate of Request: ${clientRequest.date}
        \nSalesperson: ${clientRequest.salesPerson}
        \nMeasurement Cost: ${clientRequest.measurementData.cost}
        \nSupply/Fix: ${clientRequest.measurementData.supplyFix}
        \nSite Contact person: ${clientRequest.measurementData.contactPerson}
        \nTime for Visit: ${clientRequest.measurementData.time}
        \nDate for Visit: ${clientRequest.measurementData.date}
        `
        )

    }

    return (
        <div>
            {!loading && (
                <div>
                    <div className='w-full pl-8'>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => router.back()}>
                            Go Back
                        </button>
                    </div>
                    <p className='mt-2 text-2xl text-center font-bold mb-4'>
                        Send Client Information to BOQ
                    </p>
                    {/* <p className='mt-8 text-xl mb-4 text-center font-bold'>Upload Invoice</p> */}

                    <div className='flex flex-col gap-4 '>
                        <div className='mx-auto'>
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                className='mx-auto border-2 border-black p-2'
                            />
                            <button
                                className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2'
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                        <p className='mt-4 text-2xl text-center font-bold'>
                            Search in date range
                        </p>


                        <div className='mx-auto flex gap-4 mb-4'>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='border-2 border-black p-2'
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className='border-2 border-black p-2'
                            />
                            <button
                                className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2'
                                onClick={handleDateSearch}
                            >
                                Search
                            </button>
                        </div>
                        {clientRequests.map((clientRequest) => (
                            <div key={clientRequest.id} className='items-center sm:mx-24 grid grid-cols-3 gap-x-12 mb-4'>
                                <p className='text-lg'>{clientRequest.name} (<span>{clientRequest.clientId}</span>)</p>
                                <button
                                    className="bg-green-400 hover:bg-green-500 p-2"
                                    onClick={() => handleSendInfo(clientRequest.clientId)}
                                >
                                    Send to BOQ
                                </button>
                                <button className="bg-green-400 hover:bg-green-500 p-2"
                                    onClick={() => handleCheckInfo(clientRequest.clientId)}
                                >
                                    Check Info
                                </button>

                            </div>
                        ))
                        }

                    </div>
                </div>
            )}
        </div>
    )
}

export default SendInfoBOQ