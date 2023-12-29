import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'

function SalesData() {

    const [searchDate, setSearchDate] = useState('')
    const [salesData, setSalesData] = useState(null);
    const [visitedToday, setVisitedToday] = useState(0)

    const router = useRouter();
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')



    const dbNames = {
        "Galleria": "sales",
        "Mirage": "mirage-sales",
        "Kisumu": "kisumu-sales",
        "Mombasa Road": "mombasa-sales",
    }
    const dbName = dbNames[showroomName]

    const parseDate = (date) => {
        const dateObj = new Date(date)
        return dateObj.toDateString()
    }

    const handleSearch = () => {
        // Get data from firebase

        const fetch = onSnapshot(collection(db, dbName), (snapshot) => {
            var sales = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            console.log(parseDate(searchDate))
            sales = sales.filter((sale) => sale.id === parseDate(searchDate))
            sales = sales[0]
            console.log(sales)
            if (sales) {
                setSalesData(sales)
                setVisitedToday(sales["Called"] + sales["Just visited"] + sales["bought OTC"] + sales["asked for quotes"])
            }
        })
        return fetch
    }


    return (
        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col max-w-2xl mx-auto gap-4'>
                <p>Select date for which sales data needed</p>
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className='border-2 border-black p-2'
                />
                <button className='bg-slate-300 p-2 rounded-lg' onClick={handleSearch}>Search</button>
                {salesData && (
                    <div className='flex flex-col gap-4'>
                        <p className='text-2xl'>Sales Data for {searchDate}</p>
                        <div className='flex flex-col gap-4'>
                            <p className='text-xl'>Total Visits: {visitedToday}</p>
                            <p className='text-xl'>Total Calls: {salesData["Called"]}</p>
                            <p className='text-xl'>Total Visits: {salesData["Just visited"]}</p>
                            <p className='text-xl'>Total OTC: {salesData["bought OTC"]}</p>
                            <p className='text-xl'>Total Quotes: {salesData["asked for quotes"]}</p>
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
}

export default SalesData