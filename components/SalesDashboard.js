import React from 'react'
import { useRouter } from 'next/router'
import ClientHistory from './ClientHistory'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Link from 'next/link'

export default function SalesDashboard({ showroomName }) {
    const visitors = 20
    const calls = 1
    const visitorsRecent = 4
    const boughtOTC = 10
    const quotesAsked = 5

    const router = useRouter()
    function BOQHandler() {
        //transfer firebase data of client to BOQ 
        alert("Data sent to BOQ")
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


    return (
        <div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-12'>
                <p className='my-4 text-3xl text-center'>{showroomName} Showroom</p>
                <button className='bg-red-500 p-3 rounded-lg'
                    onClick={logoutHandler}
                >Logout</button>
            </div>

            {/* <div className='flex flex-col sm:flex-row sm:p-24 items-center justify-center gap-8 sm:gap-24'>
                <div className='flex flex-col text-xl gap-8'>
                    <p className='text-center'>{visitors} Visitors today</p>
                    <p className='text-center'>{calls} Called</p>
                    <p className='text-center'>{visitorsRecent} just visited</p>
                    <p className='text-center'>{boughtOTC} Bought OTC</p>
                    <p className='text-center'>{quotesAsked} asked for Quotes</p>
                </div>
                <div className='flex flex-col text-xl gap-4'>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Invocing
                    </button>
                    <button onClick={BOQHandler}
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Send Information to BOQ
                    </button>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Check Client History
                    </button>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Reports
                    </button>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full sm:max-w-[25vw]'>
                        Upload Order
                    </button>
                </div>

            </div> */}
            <div className='flex flex-col items-center gap-4 mt-6'>
                <Link href={{
                    pathname: '/clienthistory',
                    query: { showroomName: showroomName },
                }}
                    className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'>
                    Client History
                </Link>
                <Link href={{
                    pathname: '/ClientForm',
                    query: { showroomName: showroomName },
                }}
                    className='bg-slate-900 hover:bg-slate-700 text-white p-3 w-full sm:max-w-[25vw] text-center'>
                    Client Form
                </Link>
            </div>

        </div >
    )
}
