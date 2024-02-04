import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Sales2ReportHistory() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    // const reportType = searchParams.get('reportParam')
    const [loading, setLoading] = useState(true)
    const showroomDbNames = {
        "Galleria": "galleria-sales2-report",
        "Mirage": "mirage-sales2-report",
        "Kisumu": "kisumu-sales2-report",
        "Mombasa Road": "mombasa-sales2-report"
    }
    const showroomDbName = showroomDbNames[showroomName]
    const router = useRouter()
    const date = new Date().toLocaleDateString()

    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
            var reports = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setReports(reports)
        })

        setLoading(false)
        return fetch
    }, [])

    const [selectedReportDate, setSelectedReportDate] = useState(-1);
    const handleClick = (reportDate) => {
        setSelectedReportDate(reportDate === selectedReportDate ? null : reportDate);
    };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    function handleDateSearch() {
        if (startDate === null || endDate === null) {
            alert('Please select a date range')
        }
        if (startDate && endDate) {
            if (parseDate(startDate) > parseDate(endDate)) {
                alert('End date should be greater than start date');
                return;
            }
        }
        else {
            const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
                var reports = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                const filteredReports = reports.filter((report) => {
                    const [day, month, year] = report[0].Date.split('-').map(Number);
                    const reportDate = new Date(year, month - 1, day);
                    const start = new Date(startDate)
                    const end = new Date(endDate)
                    console.log(reportDate, start, end)
                    return reportDate >= start && reportDate <= end
                })
                setReports(filteredReports)
            })
            setLoading(false)
            return fetch
        }
    }

    return (
        <>
            {!loading && (
                <div>
                    <div className='w-full pl-6'>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => router.back()}>
                            Go Back
                        </button>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p className='text-3xl mb-4'>Sales Reports History</p>
                    </div>
                    <p className='text-2xl text-center font-bold'>
                        Search in date range
                    </p>
                    <div className='my-4 mx-auto flex gap-4'>
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
                    <div className='max-w-full overflow-auto'>
                        {reports.map((report) =>
                            <div key={report[0].Date} className='p-2 bg-slate-300'
                                onClick={() => handleClick(report[0].Date)}>
                                <p>Report Date : {report[0].Date}</p>
                                {selectedReportDate === report[0].Date && (
                                    <table className='table-auto w-full mt-4'>
                                        <thead>
                                            <tr>
                                                <th className='p-2 border border-black'>S. No.</th>
                                                <th className='p-2 border border-black'>Date</th>
                                                <th className='p-2 border border-black'>Client Name</th>
                                                <th className='p-2 border border-black'>Description of Goods</th>
                                                <th className='p-2 border border-black'>Invoice No.</th>
                                                <th className='p-2 border border-black'>Invoice Value</th>
                                                <th className='p-2 border border-black'>Tax Amount</th>
                                                <th className='p-2 border border-black'>Total including Tax</th>
                                                <th className='p-2 border border-black'>Payment</th>
                                                <th className='p-2 border border-black'>Mode of Payment</th>
                                                <th className='p-2 border border-black'>Balance</th>
                                                <th className='p-2 border border-black'>Remarks</th>
                                                <th className='p-2 border border-black'>Reference</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(report).map((key, index) => (
                                                <tr key={index}>
                                                    <td className='border border-black p-2'>{index + 1}</td>
                                                    <td className='border border-black p-2'>{report[key].Date}</td>
                                                    <td className='border border-black p-2'>{report[key].ClientName}</td>
                                                    <td className='border border-black p-2'>{report[key].Description}</td>
                                                    <td className='border border-black p-2'>{report[key].InvoiceNo}</td>
                                                    <td className='border border-black p-2'>{report[key].InvoiceValue}</td>
                                                    <td className='border border-black p-2'>{report[key].Tax}</td>
                                                    <td className='border border-black p-2'>{report[key].TotalValue}</td>
                                                    <td className='border border-black p-2'>{report[key].Payment}</td>
                                                    <td className='border border-black p-2'>{report[key].ModeOfPayment}</td>
                                                    <td className='border border-black p-2'>{report[key].Balance}</td>
                                                    <td className='border border-black p-2'>{report[key].Remarks}</td>
                                                    <td className='border border-black p-2'>{report[key].Reference}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )
            }
        </>
    )
}
