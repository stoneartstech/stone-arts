import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'

function SalesData() {

    const [searchDate, setSearchDate] = useState('')

    const [salesData, setSalesData] = useState([]);
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

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    function handleDateSearch() {
        if (startDate && endDate) {
            if (parseDate(startDate) > parseDate(endDate)) {
                alert('End date should be greater than start date');
                return;
            }
        }
        const fetch = onSnapshot(collection(db, dbName), (snapshot) => {
            var sales = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setSalesData(sales.filter((saleData) => {
                const salesDate = parseDate(saleData.id);
                console.log(salesDate);
                console.log(startDate);
                return ((salesDate >= parseDate(startDate) || !startDate) &&
                    (salesDate <= parseDate(endDate) || !endDate))
            }
            ))
        }
        )
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
                <p className='text-2xl text-center font-bold'>
                    Sales Data
                </p>
                <p className='mt-4 text-2xl text-center '>
                    Search in date range
                </p>
                <div className='mx-auto flex gap-4'>
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
                {salesData && (
                    <table className='table-auto w-full mt-4'>
                        <thead>
                            <tr>
                                <th className='border border-black p-2'>Date</th>
                                <th className='border border-black p-2'>Total Visits</th>
                                <th className='border border-black p-2'>Total Called</th>
                                <th className='border border-black p-2'>Just Visited</th>
                                <th className='border border-black p-2'>Bought OTC</th>
                                <th className='border border-black p-2'>Asked for quotes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.map((data) => (
                                <tr key={data.id}>
                                    <td className='border border-black p-2'>{data.id.substring(4)}</td>
                                    <td className='border border-black p-2'>{data["Called"] + data["Just visited"] + data["bought OTC"] + data["asked for quotes"]}</td>
                                    <td className='border border-black p-2'>{data["Called"]}</td>
                                    <td className='border border-black p-2'>{data["Just visited"]}</td>
                                    <td className='border border-black p-2'>{data["bought OTC"]}</td>
                                    <td className='border border-black p-2'>{data["asked for quotes"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    // <div className='flex flex-col gap-4'>
                    //     {salesData.map((data) => (
                    //         <div className='flex flex-col gap-4'>
                    //             <p className='text-xl'>Date : {data.id}</p>
                    //             <p className=''>Total Visits: {visitedToday}</p>
                    //             <p className=''>Total Calls: {data["Called"]}</p>
                    //             <p className=''>Total Visits: {data["Just visited"]}</p>
                    //             <p className=''>Total OTC: {data["bought OTC"]}</p>
                    //             <p className=''>Total Quotes: {data["asked for quotes"]}</p>
                    //         </div>
                    //     ))}
                    // </div>
                )}
            </div>


        </div>
    )
}

export default SalesData