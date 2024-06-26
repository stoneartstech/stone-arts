import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'

export default function MeasurementRequestsDisplay() {

    const router = useRouter();

    const [loading, setLoading] = useState(false)
    const [measurementRequests, setMeasurementRequests] = useState([]);
    const [originalMeasurementRequests, setOriginalMeasurementRequests] = useState([]);


    useEffect(() => {
        const requestsRef = collection(db, 'boq');
        const requestsSnapshot = onSnapshot(requestsRef, (snapshot) => {
            const requestsList = snapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id })
            );
            setMeasurementRequests(requestsList);
            setOriginalMeasurementRequests(requestsList);
        });
    }, []);

    function handleButtonClick(name) {
        measurementRequests.forEach((request) => {
            if (request.name === name) {
                request.showDetails = !request.showDetails;
            }
        });
        setMeasurementRequests([...measurementRequests]);
    }

    function handleSearch() {

        setMeasurementRequests(originalMeasurementRequests.filter((measurementRequest) => {
            var searchParam = search.toLowerCase()
            return (measurementRequest.name.toLowerCase().includes(searchParam)
                || measurementRequest.clientId.toString().includes(searchParam)
                || measurementRequest.email.toLowerCase().includes(searchParam)
                || measurementRequest.number.toString().includes(searchParam)
                || measurementRequest.address.toLowerCase().includes(searchParam)
                || measurementRequest.date.toString().includes(searchParam)
                || measurementRequest.aspect.toLowerCase().includes(searchParam)
                || measurementRequest.option.toLowerCase().includes(searchParam)
                || measurementRequest.sourceInfo.toLowerCase().includes(searchParam)
            )
        }
        ))
    }


    return <>{!loading && (
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='mt-8 text-2xl text-center font-bold mb-4'>Measurement Requests from Clients</p>
            <div className='flex flex-col text-xl gap-4 items-center'>
                <div className='flex gap-2'>
                    <input onChange={(e) => setSearch(e.target.value)}
                        className='mx-auto border-2 border-black p-2'
                    />
                    <button className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg'
                        onClick={handleSearch}
                    >Search</button>
                </div>
                {measurementRequests.map((measurementRequest) => (
                    <div key={measurementRequest.clientId} className='flex flex-col gap-2 p-4 w-[80vw] border-2 border-black'>
                        <button onClick={() => handleButtonClick(measurementRequest.name)}>{measurementRequest.clientId} : {measurementRequest.name}</button>
                        {measurementRequest.showDetails && (
                            <div>
                                <p>Client Name: {measurementRequest.name}</p>
                                <p>Client Email: {measurementRequest.email}</p>
                                <p>Client Number: {measurementRequest.number}</p>
                                <p>Client Address: {measurementRequest.address}</p>
                                <p>Date of Request: {measurementRequest.date}</p>
                                <p>Interested Aspect: {measurementRequest.aspect}</p>
                                <p>Request Category: {measurementRequest.option}</p>
                                <p>How did Client get to know about us:{" "}
                                    {measurementRequest.sourceInfo !== 'other' && measurementRequest.sourceInfo}
                                    {measurementRequest.sourceInfo === 'other' && measurementRequest.specificInfo}
                                </p>

                                {measurementRequest.option == 'measurement' &&
                                    <div><p className='font-bold'>Measurement Request:</p>
                                        <p>Cost: {measurementRequest.measurementData.cost}</p>
                                        <p>Date: {measurementRequest.measurementData.date}</p>
                                        <p>Time: {measurementRequest.measurementData.time}</p>
                                        <p>Supply/Fix: {measurementRequest.measurementData.supplyFix}</p>
                                        <p>Contact Person: {measurementRequest.measurementData.contactPerson}</p>
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
