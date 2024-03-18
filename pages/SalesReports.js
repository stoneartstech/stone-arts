import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SalesReports() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const reports = [
        {
            name: "Visitors Report",
            upload: "/SalesReports/VisitorsReportUpload",
            history: "/SalesReports/VisitorsReportHistory"
        },


        {
            name: "Sales Report(Daily)",
            upload: "/SalesReports/SalesReportUpload",
            history: "/SalesReports/SalesReportHistory"
        },
        {
            name: "Showroom Delivery",
            upload: "/SalesReports/DeliveryReportUpload",
            history: "/SalesReports/DeliveryReportHistory"
        },
        {
            name: "Sales Report(Weekly/Monthly)",
            upload: "/SalesReports/WeeklySalesReport",
            history: "/SalesReports/MonthlySalesReport"
        },
        {
            name: "Showroom Cleanliness",
            upload: "/SalesReports/CleanlinessReportUpload",
            history: "/SalesReports/CleanlinessReportHistory"
        },
    ]

    return (
        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='mt-2 text-2xl text-center font-bold mb-4'>
                Reports
            </p>
            {reports.map((report) => (
                <div key={report.param} className='items-center sm:mx-24 grid grid-cols-3 gap-x-12 mb-4'>
                    <p className='text-lg text-center'>{report.name}</p>
                    <Link href={{
                        pathname: report.upload,
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        {report.name === "Sales Report(Weekly/Monthly)" ? "Weekly Report" : "Upload Report"}
                    </Link>
                    <Link href={{
                        pathname: report.history,
                        query: { showroomName: showroomName },
                    }}
                        className='bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center'
                    >
                        {report.name === "Sales Report(Weekly/Monthly)" ? "Monthly Report" : "Report History"}
                    </Link>
                </div>
            ))}
        </div>
    )
}
