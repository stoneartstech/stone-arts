import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VisitorsReportHistory() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    // const reportType = searchParams.get('reportParam')
    const [loading, setLoading] = useState(true)
    const showroomDbNames = {
        "Galleria": "galleria-visitors-report",
        "Mirage": "mirage-visitors-report",
        "Kisumu": "kisumu-visitors-report",
        "Mombasa Road": "mombasa-visitors-report"

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
        console.log(reports)
        setLoading(false)
        return fetch
    }, [])

    const [selectedReportDate, setSelectedReportDate] = useState(-1);
    const handleClick = (reportDate) => {
        setSelectedReportDate(reportDate === selectedReportDate ? null : reportDate);
    };

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
                        <p className='text-3xl mb-4'>Visitors Reports History</p>
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
                                                <th className='border border-black p-2'>S. No.</th>
                                                <th className='border border-black p-2'>Date</th>
                                                <th className='border border-black p-2'>Client Name</th>
                                                <th className='border border-black p-2'>Designer</th>
                                                <th className='border border-black p-2'>Owner</th>
                                                <th className='border border-black p-2'>Architect</th>
                                                <th className='border border-black p-2'>Material Of Interest</th>
                                                <th className='border border-black p-2'>Sample Catalogue</th>
                                                <th className='border border-black p-2'>Progress</th>
                                                <th className='border border-black p-2'>Contact</th>
                                                <th className='border border-black p-2'>Site Location</th>
                                                <th className='border border-black p-2'>Follow Up</th>
                                                <th className='border border-black p-2'>Reference</th>
                                                <th className='border border-black p-2'>Chances</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(report).map((key, index) => (
                                                <tr key={index}>
                                                    <td className='border border-black p-2'>{index + 1}</td>
                                                    <td className='border border-black p-2'>{report[key].Date}</td>
                                                    <td className='border border-black p-2'>{report[key].ClientName}</td>
                                                    <td className='border border-black p-2'>{report[key].Designer}</td>
                                                    <td className='border border-black p-2'>{report[key].Owner}</td>
                                                    <td className='border border-black p-2'>{report[key].Architect}</td>
                                                    <td className='border border-black p-2'>{report[key].Material}</td>
                                                    <td className='border border-black p-2'>{report[key].SampleCatalogue}</td>
                                                    <td className='border border-black p-2'>{report[key].Progress}</td>
                                                    <td className='border border-black p-2'>{report[key].Contact}</td>
                                                    <td className='border border-black p-2'>{report[key].SiteLocation}</td>
                                                    <td className='border border-black p-2'>{report[key].FollowUp}</td>
                                                    <td className='border border-black p-2'>{report[key].Reference}</td>
                                                    <td className='border border-black p-2'>{report[key].Chances}</td>
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
