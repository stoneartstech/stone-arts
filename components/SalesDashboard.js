import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ClientHistory from './ClientHistory'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDocs, setDoc, docRef } from 'firebase/firestore';
import Link from 'next/link'

export default function SalesDashboard({ showroomName }) {

    const dbNames = {
        "Galleria": "sales",
        "Mirage": "mirage-sales",
        "Kisumu": "kisumu-sales",
        "Mombasa Road": "mombasa-sales",
    }
    const dbName = dbNames[showroomName]
    const [visitedToday, setVisitedToday] = useState(0)
    const [salesData, setSalesData] = useState({
        "Called": 0,
        "Just visited": 0,
        "bought OTC": 0,
        "asked for quotes": 0,
    });
    const date = new Date().toDateString()

    useEffect(() => {
        // Get data from firebase
        const fetch = onSnapshot(collection(db, dbName), (snapshot) => {
            var sales = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            sales = sales.filter((sale) => sale.id === date)
            sales = sales[0]
            console.log(sales)
            if (sales) {
                setSalesData(sales)
                setVisitedToday(sales["Called"] + sales["Just visited"] + sales["bought OTC"] + sales["asked for quotes"])
            }
        })
        return fetch
    }
        , [])

    const router = useRouter()
    function BOQHandler() {
        //transfer firebase data of client to BOQ 
        return
    }
    const { logout } = useAuth()
    async function logoutHandler() {
        try {
            await logout()
            router.push('/')
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleIncrement = (key) => {
        setSalesData((prevState) => {
            const updatedState = {
                ...prevState,
                [key]: prevState[key] + 1,
            };
            setVisitedToday((prevVisited) => prevVisited + 1);
            updateSalesData(updatedState);
            return updatedState;
        });
    };

    const handleDecrement = (key) => {
        setSalesData((prevState) => {
            const updatedState = {
                ...prevState,
                [key]: Math.max(prevState[key] - 1, 0),
            };
            setVisitedToday((prevVisited) => Math.max(prevVisited - 1, 0));
            updateSalesData(updatedState);
            return updatedState;
        });
    };

    const updateSalesData = (updatedState) => {
        // Update data in firebase
        const salesRef = doc(db, dbName, date);
        const orderedState = {
            "Called": updatedState["Called"] || 0,
            "Just visited": updatedState["Just visited"] || 0,
            "bought OTC": updatedState["bought OTC"] || 0,
            "asked for quotes": updatedState["asked for quotes"] || 0,
        };
        setDoc(salesRef, orderedState);
    };



    return (
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
                <button className='bg-red-500 p-2 rounded-lg'
                    onClick={logoutHandler}
                >Logout</button>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-12 my-4'>
                <p className='my-4 text-3xl text-center'>{showroomName} Showroom</p>
            </div>

            <div className='flex flex-col sm:flex-row sm:p-24 items-center justify-center gap-8 sm:gap-24'>
                <div className='flex flex-col text-xl gap-8'>
                    <div className='flex items-center gap-2'>
                        <p className='text-center'>{visitedToday} Visited today</p>
                    </div>
                    {Object.keys(salesData).slice(1).map((key, index) => (
                        <div className='flex items-center gap-2' key={index}>
                            <p className='text-center'>{salesData[key]} {key}</p>
                            <button className='w-8 h-8 bg-green-400' onClick={() => handleIncrement(key)}> + </button>
                            <button className='w-8 h-8 bg-red-400' onClick={() => handleDecrement(key)}> - </button>
                        </div>
                    ))}
                </div>
                <div className='flex flex-col text-xl gap-4'>
                    <Link href={{
                        pathname: '/SalesInvoice',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        Invoicing
                    </Link>
                    <Link href={{
                        pathname: '/SendInfoBOQ',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        Send Information to BOQ
                    </Link>
                    <Link href={{
                        pathname: '/ClientRequests',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        Check Client History
                    </Link>
                    <Link href={{
                        pathname: '/SalesReports',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        Reports
                    </Link>
                    <Link href={{
                        pathname: '/OrdersDashboard',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        Orders
                    </Link>
                    <Link href={{
                        pathname: '/SalesData',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        Sales Data
                    </Link>
                    <Link href={{
                        pathname: '/ClientForm',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-900 hover:bg-slate-700 text-white p-3 w-full sm:max-w-[25vw] text-center'>
                        Client Form
                    </Link>
                </div>

            </div>
            {/* <div className='flex flex-col items-center gap-4 mt-4'>
                <Link href={{
                    pathname: '/ClientForm',
                    query: { showroomName: showroomName },
                }}
                    className='bg-slate-900 hover:bg-slate-700 text-white p-3 w-full sm:max-w-[25vw] text-center'>
                    Client Form
                </Link>
            </div> */}

        </div >
    )
}
