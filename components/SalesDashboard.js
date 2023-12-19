import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ClientHistory from './ClientHistory'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Link from 'next/link'

export default function SalesDashboard({ showroomName }) {


    const [salesData, setSalesData] = useState({
        "Visited today": 0,
        "Called": 0,
        "Just visited": 0,
        "bought OTC": 0,
        "asked for quotes": 0,
    });

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
        setSalesData(prevState => ({
            ...prevState,
            [key]: prevState[key] + 1,
            "Visited today": prevState["Visited today"] + 1
        }));
    };

    const handleDecrement = (key) => {
        setSalesData(prevState => ({
            ...prevState,
            [key]: Math.max(prevState[key] - 1, 0), // Ensure the value doesn't go below 0
            "Visited today": Math.max(prevState["Visited today"] - 1, 0)
        }));

    };


    return (
        <div>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-12 mb-4'>
                <p className='my-4 text-3xl text-center'>{showroomName} Showroom</p>
                <button className='bg-red-500 p-3 rounded-lg'
                    onClick={logoutHandler}
                >Logout</button>
            </div>

            <div className='flex flex-col sm:flex-row sm:p-24 items-center justify-center gap-8 sm:gap-24'>
                <div className='flex flex-col text-xl gap-8'>
                    <div className='flex items-center gap-2'>
                        <p className='text-center'>{salesData["Visited today"]} Visited today</p>
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
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Invoicing
                    </button>
                    <button onClick={BOQHandler}
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Send Information to BOQ
                    </button>
                    <Link href={{
                        pathname: '/ClientRequests',
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        Client History
                    </Link>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Reports
                    </button>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Upload Order
                    </button>
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
