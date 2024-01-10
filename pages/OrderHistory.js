import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc, getDoc, docs } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function OrderHistory() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const [loading, setLoading] = useState(true)
    const showroomDbNames = {
        "Galleria": "orders",
        "Mirage": "mirage-orders",
        "Kisumu": "kisumu-orders",
        "Mombasa Road": "mombasa-orders",
    }
    const showroomDbName = showroomDbNames[showroomName]
    const router = useRouter()

    const [clientCode, setClientCode] = useState('')
    const [orderId, setOrderId] = useState(0)
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [workshop, setWorkshop] = useState('matasia')
    const [location, setLocation] = useState('')
    const [name, setName] = useState('')
    const [orderDesignation, setOrderDesignation] = useState('showroom')
    const [orderType, setOrderType] = useState('standard')
    const [orderDate, setOrderDate] = useState('')
    const [order, setOrder] = useState({})

    const [ordersData, setOrdersData] = useState([])
    useEffect(() => {
        const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
            var orders = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setOrdersData(orders)
        })
        setLoading(false)
        return fetch
    }, [])

    const [selectedOrderId, setSelectedOrderId] = useState(-1);
    const handleClick = (orderId) => {
        setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
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
                        <p className='text-3xl'>Order History</p>
                    </div>
                    <div className='flex flex-col gap-4 mt-2'>
                        {ordersData.map((order) =>
                            <div key={order.orderId} className='p-2 bg-slate-300'
                                onClick={() => handleClick(order.orderId)}>
                                <p>Order Id: {order.orderId}</p>
                                {selectedOrderId === order.orderId && (
                                    <div className='p-2 bg-slate-300 mt-2'>
                                        <p>Order Date: {order.date}</p>
                                        <p>Order Type: {order.orderType}</p>
                                        <p>Order Designation: {order.orderDesignation}</p>
                                        <p>Client Code: {order.clientCode}</p>
                                        <p>Invoice Number: {order.invoiceNumber}</p>
                                        <p>Location: {order.location}</p>
                                        <p>Client Name: {order.name}</p>
                                        <p>Workshop: {order.workshop}</p>
                                        <p>Order Status: {order.confirmed === true ? "confirmed" : "not confirmed"}</p>

                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Prod Name</th>
                                                    <th>Prod Desc</th>
                                                    <th>Size</th>
                                                    <th>Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.order.map((item) =>
                                                    <tr key={item.prodName}>
                                                        <td className='px-6'>{item.prodName}</td>
                                                        <td className='px-12'>{item.prodDesc}</td>
                                                        <td className='px-6'>{item.Size}</td>
                                                        <td className='px-4 text-center'>{item.Qty}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                    </div>
                                )}
                            </div>

                        )}
                    </div>

                </div>
            )}
        </>
    )
}
