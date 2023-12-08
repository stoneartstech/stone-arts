import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'

export default function ClientHistory({ showroomName }) {

    const [clientRequests, setClientRequests] = useState([])
    const [originalClientRequests, setOriginalClientRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clients'), (snapshot) => {
            var clientRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            clientRequests = clientRequests.filter((clientRequest) => clientRequest.showroom === showroomName)

            setClientRequests(clientRequests)
            setOriginalClientRequests(clientRequests)
            setLoading(false)
        })

        return fetch
    }, [])

    // async function getClientRequests() {
    //     const querySnapshot = await getDocs(collection(db, 'clients'));
    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.id, ' => ', doc.data());
    //     });
    // };
    function handleButtonClick(name) {
        clientRequests.forEach((request) => {
            if (request.name === name) {
                request.showDetails = !request.showDetails;
            }
        });
        setClientRequests([...clientRequests]);
    }

    function handleSearch() {

        setClientRequests(originalClientRequests.filter((clientRequest) => {
            var searchParam = search.toLowerCase()
            return (clientRequest.name.toLowerCase().includes(searchParam)
                || clientRequest.clientId.toString().includes(searchParam)
                || clientRequest.email.toLowerCase().includes(searchParam)
                || clientRequest.number.toString().includes(searchParam)
                || clientRequest.address.toLowerCase().includes(searchParam)
                || clientRequest.date.toString().toLowerCase().includes(searchParam)
                || clientRequest.aspects.join('').toLowerCase().includes(searchParam)
                || clientRequest.option.toLowerCase().includes(searchParam)
                || clientRequest.sourceInfo.toLowerCase().includes(searchParam)
            )
        }
        ))
    }


    return <>{!loading && (
        <div>
            <p className='mt-8 text-2xl text-center font-bold mb-4'>Requests from Clients</p>
            <div className='flex flex-col text-xl gap-4 items-center'>
                <div className='flex gap-2'>
                    <input onChange={(e) => setSearch(e.target.value)}
                        className='mx-auto border-2 border-black p-2'
                    />
                    <button className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg'
                        onClick={handleSearch}
                    >Search</button>
                </div>

                {clientRequests.map((clientRequest) => (
                    <div key={clientRequest.clientId} className='flex flex-col gap-2 p-4 w-[80vw] border-2 border-black'>
                        <button onClick={() => handleButtonClick(clientRequest.name)}>{clientRequest.clientId} : {clientRequest.name}</button>
                        {clientRequest.showDetails && (
                            <div>
                                <p>Client Name: {clientRequest.name}</p>
                                <p>Client Email: {clientRequest.email}</p>
                                <p>Client Number: {clientRequest.number}</p>
                                <p>Client Address: {clientRequest.address}</p>
                                <p>Date of Request: {clientRequest.date}</p>
                                <p>Interested Aspects: {
                                    clientRequest.aspects.join(', ')
                                }</p>
                                <p>Request Category: {clientRequest.option}</p>
                                <p>How did Client get to know about us:{" "}
                                    {clientRequest.sourceInfo !== 'other' && clientRequest.sourceInfo}
                                    {clientRequest.sourceInfo === 'other' && clientRequest.specificInfo}
                                </p>

                                {clientRequest.option == 'measurement' &&
                                    <div><p className='font-bold'>Measurement Request:</p>
                                        <p>Cost: {clientRequest.measurementData.cost}</p>
                                        <p>Date: {clientRequest.measurementData.date}</p>
                                        <p>Time: {clientRequest.measurementData.time}</p>
                                        <p>Supply/Fix: {clientRequest.measurementData.supplyFix}</p>
                                        <p>Contact Person: {clientRequest.measurementData.contactPerson}</p>
                                    </div>
                                }
                            </div>
                        )}
                    </div>))
                }


            </div>


        </div>
    )}</>
}
