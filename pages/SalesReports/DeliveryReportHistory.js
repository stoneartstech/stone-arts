import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import * as XLSX from 'xlsx';

export default function DeliveryReportHistory() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    // const reportType = searchParams.get('reportParam')
    const [loading, setLoading] = useState(true)
    const showroomDbNames = {
        "Galleria": "galleria-delivery-report",
        "Mirage": "mirage-delivery-report",
        "Kisumu": "kisumu-delivery-report",
        "Mombasa Road": "mombasa-delivery-report"

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

    // Convert string to ArrayBuffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    function handleExportToExcel(report) {
        const ws_data = [
            ["S. No.", "Date", "Client Name", "Description of Goods", "Sales Order No.", "Invoice Number", "Invoice Value including TAX", "Purchase Order Np.", "Purchase Order Date", "Expected Delivery Date", "Updated In Application"],
            ...Object.keys(report).map((key, index) => [
                index + 1,
                report[key].Date,
                report[key].ClientName,
                report[key].Description,
                report[key].SalesOrderNumber,
                report[key].InvoiceNumber,
                report[key].InvoiceValue,
                report[key].PurchaseOrderNumber,
                report[key].PurchaseOrderDate,
                report[key].ExpectedDeliveryDate,
                report[key].UpdatedInApp,
            ]),
        ];

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Delivery Report');

        // Save the Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([s2ab(excelBuffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = `Delivery_Report_${report[0].Date}_${showroomName}.xlsx`;

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(excelBlob);
        link.download = fileName;
        link.click();
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
                        <p className='text-3xl mb-4'>Showroom Delivery Reports History</p>
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
                            <div key={report[0].Date} className='p-2 bg-slate-300  my-2'
                                onClick={() => handleClick(report[0].Date)}>
                                <div className='flex flex-row justify-between items-center'>
                                    <p>Report Date : {report[0].Date}</p>
                                    <button className='bg-slate-400 p-2' onClick={() => handleExportToExcel(report)}>
                                        Export to Excel
                                    </button>
                                </div>
                                {selectedReportDate === report[0].Date && (
                                    <table className='table-auto w-full mt-4'>
                                        <thead>
                                            <tr>
                                                <th className='border border-black p-2'>S. No.</th>
                                                <th className='border border-black p-2'>Date</th>
                                                <th className='border border-black p-2'>Client Name</th>
                                                <th className='border border-black p-2'>Description of Goods</th>
                                                <th className='border border-black p-2'>Sales Order No.</th>
                                                <th className='border border-black p-2'>Invoice Number</th>
                                                <th className='border border-black p-2'>Invoice Value including TAX</th>
                                                <th className='border border-black p-2'>Purchase Order Np.</th>
                                                <th className='border border-black p-2'>Purchase Order Date</th>
                                                <th className='border border-black p-2'>Expected Delivery Date</th>
                                                <th className='border border-black p-2'>Updated In Application</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(report).map((key, index) => (
                                                <tr key={index}>
                                                    <td className='border border-black p-2'>{index + 1}</td>
                                                    <td className='border border-black p-2'>{report[key].Date}</td>
                                                    <td className='border border-black p-2'>{report[key].ClientName}</td>
                                                    <td className='border border-black p-2'>{report[key].Description}</td>
                                                    <td className='border border-black p-2'>{report[key].SalesOrderNumber}</td>
                                                    <td className='border border-black p-2'>{report[key].InvoiceNumber}</td>
                                                    <td className='border border-black p-2'>{report[key].InvoiceValue}</td>
                                                    <td className='border border-black p-2'>{report[key].PurchaseOrderNumber}</td>
                                                    <td className='border border-black p-2'>{report[key].PurchaseOrderDate}</td>
                                                    <td className='border border-black p-2'>{report[key].ExpectedDeliveryDate}</td>
                                                    <td className='border border-black p-2'>{report[key].UpdatedInApp}</td>

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
