import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function DeliveryReportUpload() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    // const reportType = searchParams.get('reportParam')
    const [loading, setLoading] = useState(false)
    const showroomDbNames = {
        "Galleria": "galleria-delivery-report",
        "Mirage": "mirage-delivery-report",
        "Kisumu": "kisumu-delivery-report",
        "Mombasa Road": "mombasa-delivery-report"

    }
    const showroomDbName = showroomDbNames[showroomName]

    const router = useRouter()

    const today = new Date()
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

    const [report, setReport] = useState([
        {
            SNo: 1,
            Date: date,
            ClientName: '',
            Description: '',
            SalesOrderNumber: '',
            InvoiceNumber: '',
            InvoiceValue: '',
            PurchaseOrderNumber: '',
            PurchaseOrderDate: '',
            ExpectedDeliveryDate: '',
            UpdatedInApp: '',
        }])

    const handleAddRow = () => {
        const row = {
            SNo: report.length + 1,
            Date: date,
            ClientName: '',
            Description: '',
            SalesOrderNumber: '',
            InvoiceNumber: '',
            InvoiceValue: '',
            PurchaseOrderNumber: '',
            PurchaseOrderDate: '',
            ExpectedDeliveryDate: '',
            UpdatedInApp: '',
        }
        setReport([...report, row])
    }
    const handleRemoveRow = (index) => {
        const list = [...report]
        list.splice(index, 1)
        setReport(list)
    }

    return (
        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='mt-2 text-2xl text-center font-bold mb-4'>
                Upload Showroom Delivery Report
            </p>
            <div className='max-w-full overflow-auto'>
                <table className='mt-6'>
                    <thead className=''>
                        <tr>
                            <th className='px-2'>S. No.</th>
                            <th className='px-2'>Date</th>
                            <th className='px-2'>Client Name</th>
                            <th className='px-2'>Description of Goods</th>
                            <th className='px-2'>Sales Order Number</th>
                            <th className='px-2'>Invoice No.</th>
                            <th className='px-2'>Invoice Value including Tax</th>
                            <th className='px-2'>Purchase Order No.</th>
                            <th className='px-2'>Purchase Order Date</th>
                            <th className='px-2'>Expected Delivery Date</th>
                            <th className='px-2'>Updated In Application</th>

                        </tr>
                    </thead>
                    <tbody className=''>
                        {report.map((item, index) => (
                            <tr key={index}>
                                <td className='text-center'>{index + 1}</td>
                                <td className=''>
                                    {item.Date}
                                </td>
                                <td>
                                    <input type="text" value={item.ClientName} onChange={(e) => {
                                        const list = [...report]
                                        list[index].ClientName = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.Description} onChange={(e) => {
                                        const list = [...report]
                                        list[index].Description = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.SalesOrderNumber} onChange={(e) => {
                                        const list = [...report]
                                        list[index].SalesOrderNumber = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.InvoiceNumber} onChange={(e) => {
                                        const list = [...report]
                                        list[index].InvoiceNumber = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.InvoiceValue} onChange={(e) => {
                                        const list = [...report]
                                        list[index].InvoiceValue = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.PurchaseOrderNumber} onChange={(e) => {
                                        const list = [...report]
                                        list[index].PurchaseOrderNumber = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.PurchaseOrderDate} onChange={(e) => {
                                        const list = [...report]
                                        list[index].PurchaseOrderDate = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.ExpectedDeliveryDate} onChange={(e) => {
                                        const list = [...report]
                                        list[index].ExpectedDeliveryDate = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.UpdatedInApp} onChange={(e) => {
                                        const list = [...report]
                                        list[index].UpdatedInApp = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <button className='bg-slate-300 p-2 rounded-lg'
                                        onClick={() => handleRemoveRow(index)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className='bg-slate-300 hover:bg-slate-500 p-2 rounded-lg'
                onClick={handleAddRow}>
                + Add Row
            </button>
            <button className='bg-green-400 hover:bg-green-600 py-2 px-6 rounded-lg mt-4 ml-2'
                onClick={() => {
                    //convert report to object
                    const reportData = {}
                    report.forEach((item, index) => {
                        reportData[index] = item
                    })
                    //set doc in showroomDbName database with key as date and value as reportData
                    console.log(date)
                    setDoc(doc(db, showroomDbName, `${date}`), reportData)
                    alert('Report Uploaded Successfully')
                    router.push('/')
                }}>
                Upload
            </button>

        </div>
    )
}
