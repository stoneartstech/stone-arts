import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SalesReportUpload() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    const reportType = searchParams.get('reportParam')
    const [loading, setLoading] = useState(false)

    const showroomDbNames = {
        "Galleria": {
            "visitors": "galleria-visitors-report",
            "sales": "galleria-sales-report",
            "showroom-delivery": "galleria-delivery-report",
            "sales2": "galleria-sales2-report",
            "showroom-cleanliness": "galleria-cleanliness-report",
        },
        "Mirage": {
            "visitors": "mirage-visitors-report",
            "sales": "mirage-sales-report",
            "showroom-delivery": "mirage-delivery-report",
            "sales2": "mirage-sales2-report",
            "showroom-cleanliness": "mirage-cleanliness-report",
        },
        "Kisumu": {
            "visitors": "kisumu-visitors-report",
            "sales": "kisumu-sales-report",
            "showroom-delivery": "kisumu-delivery-report",
            "sales2": "kisumu-sales2-report",
            "showroom-cleanliness": "kisumu-cleanliness-report",
        },
        "Mombasa Road": {
            "visitors": "mombasa-visitors-report",
            "sales": "mombasa-sales-report",
            "showroom-delivery": "mombasa-delivery-report",
            "sales2": "mombasa-sales2-report",
            "showroom-cleanliness": "mombasa-cleanliness-report",
        },

    }
    const showroomDbName = showroomDbNames[showroomName][reportType]

    const reportTitles = {
        "visitors": "Visitors Report",
        "sales": "Sales Report",
        "showroom-delivery": "Showroom Delivery Report",
        "sales2": "Sales Report",
        "showroom-cleanliness": "Showroom Cleanliness Report",
    }

    const router = useRouter()

    const date = new Date().toLocaleDateString()

    return (
        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='mt-2 text-2xl text-center font-bold mb-4'>
                Upload {reportTitles[reportType]}
            </p>
            <table className='w-full mt-6'>
                <thead>
                    <tr>
                        <th>S. No. </th>
                        <th>Product Name</th>
                        <th>Product Description</th>
                        <th>Size</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {order.map((item, index) => (
                        <tr key={index}>
                            <td className='text-center'>{index + 1}</td>
                            <td>
                                <input type="text" value={item.prodName} onChange={(e) => {
                                    const list = [...order]
                                    list[index].prodName = e.target.value
                                    setOrder(list)
                                }}
                                    className='p-2 w-full' />
                            </td>
                            <td>
                                <input type="text" value={item.prodDesc} onChange={(e) => {
                                    const list = [...order]
                                    list[index].prodDesc = e.target.value
                                    setOrder(list)
                                }}
                                    className='p-2 w-full' />
                            </td>
                            <td>
                                <input type="text" value={item.Size} onChange={(e) => {
                                    const list = [...order]
                                    list[index].Size = e.target.value
                                    setOrder(list)
                                }}
                                    className='p-2 w-full' />
                            </td>
                            <td>
                                <input type="text" value={item.Qty} onChange={(e) => {
                                    const list = [...order]
                                    list[index].Qty = e.target.value
                                    setOrder(list)
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
            <button className='bg-slate-300 hover:bg-slate-500 p-2 rounded-lg'
                onClick={handleAddRow}>
                + Add Row
            </button>
            <button className='bg-green-400 hover:bg-green-600 p-2 rounded-lg mt-4'
                onClick={() => {
                    const orderData = {
                        date,
                        clientCode,
                        orderId,
                        invoiceNumber,
                        workshop,
                        location,
                        name,
                        orderDesignation,
                        orderType,
                        order,
                        confirmed: false,
                    }
                    setDoc(doc(db, showroomDbName, `${orderId}`), orderData)
                    setDoc(doc(db, 'orderId', 'orderId'), { id: orderId + 1 })
                    alert('Order Sent to admin for confirmation')
                    router.push('/')
                }}>
                Send to Admin for Confirmation
            </button>

        </div>
    )
}
