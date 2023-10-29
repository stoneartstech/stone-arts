import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'

export default function BOQDashboard() {

    const [measurementRequests, setMeasurementRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clients'), (snapshot) => {
            const measurementRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setMeasurementRequests(measurementRequests)
            setLoading(false)
        })
        return fetch
    }, [])

    // async function getMeasurementRequests() {
    //     const querySnapshot = await getDocs(collection(db, 'clients'));
    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.id, ' => ', doc.data());
    //     });
    // };


    return <>{!loading && (
        <div>
            <p className='mt-8 text-2xl text-center'>Measurement Requests from Clients</p>
            <div className='flex flex-col text-xl gap-4 items-center'>
                {measurementRequests.map((measurementRequest) => (
                    <div className='flex flex-col gap-2 p-4 w-[80vw]'>
                        <p>Client Name: {measurementRequest.name}</p>
                        <p>Client Email: {measurementRequest.email}</p>
                        <p>Client Number: {measurementRequest.number}</p>
                        <p>Client Address: {measurementRequest.address}</p>
                        <p className='font-bold'>Measurement Request:</p>
                        <p>Cost: {measurementRequest.measurementData.cost}</p>
                        <p>Date: {measurementRequest.measurementData.date}</p>
                        <p>Supply/Fix: {measurementRequest.measurementData.supplyFix}</p>
                        <p>Time: {measurementRequest.measurementData.time}</p>
                        <p>Contact Person: {measurementRequest.measurementData.contactPerson}</p>
                    </div>
                ))}
            </div>


        </div>
    )}</>
}
