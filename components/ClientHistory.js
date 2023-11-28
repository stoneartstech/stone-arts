import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'

export default function ClientHistory() {

    const [clientRequests, setClientRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clients'), (snapshot) => {
            var clientRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setClientRequests(clientRequests)
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


    return <>{!loading && (
        <div>
            <p className='mt-8 text-2xl text-center font-bold mb-4'>Requests from Clients</p>
            <div className='flex flex-col text-xl gap-4 items-center'>

                {clientRequests.map((clientRequest) => (
                    <div key={clientRequest.clientId} className='flex flex-col gap-2 p-4 w-[80vw] border-2 border-black'>
                        <button onClick={() => handleButtonClick(clientRequest.name)}>{clientRequest.name}</button>
                        {clientRequest.showDetails && (
                            <div>
                                <p>Client Name: {clientRequest.name}</p>
                                <p>Client Email: {clientRequest.email}</p>
                                <p>Client Number: {clientRequest.number}</p>
                                <p>Client Address: {clientRequest.address}</p>
                                <p>Interested Aspect: {clientRequest.aspect}</p>
                                <p>Request Category: {clientRequest.option}</p>
                                <p>Delivery: {clientRequest.delivery}</p>
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
