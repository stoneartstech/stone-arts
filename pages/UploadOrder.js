import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function UploadOrder() {

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

    const requestShowroomDbNames = {
        "Galleria": "clients",
        "Mirage": "mirage-clients",
        "Kisumu": "kisumu-clients",
        "Mombasa Road": "mombasa-clients",
    }
    const requestShowroomDbName = requestShowroomDbNames[showroomName]


    const router = useRouter()

    const date = new Date().toLocaleDateString()

    const [clientCode, setClientCode] = useState('')
    const [orderId, setOrderId] = useState(0)
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [workshop, setWorkshop] = useState('matasia')
    const [location, setLocation] = useState('')
    const [name, setName] = useState('')
    const [orderDesignation, setOrderDesignation] = useState('showroom')
    const [orderType, setOrderType] = useState('standard')


    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'orderId'), (snapshot) => {
            var number = snapshot.docs[0].data()
            setOrderId(number.id)
        })
        setLoading(false)
        return fetch
    }, [])

    const [order, setOrder] = useState([
        {
            prodName: '',
            prodDesc: '',
            Size: '',
            Qty: '',
        }])

    const handleAddRow = () => {
        const row = {
            prodName: '',
            prodDesc: '',
            Size: '',
            Qty: '',
        }
        setOrder([...order, row])
    }
    const handleRemoveRow = (index) => {
        const list = [...order]
        list.splice(index, 1)
        setOrder(list)
    }

    const checkCode = () => {
        console.log(requestShowroomDbName)

        const fetch = onSnapshot(collection(db, requestShowroomDbName), (snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().clientCode === clientCode) {
                    console.log(doc.data().name)
                    setName(doc.data().name)
                }
            })
        })
        return fetch
    }
    const checkName = () => {
        const fetch = onSnapshot(collection(db, requestShowroomDbName), (snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().name === name) {
                    setClientCode(doc.data().clientCode)
                }
            })
        })
        return fetch
    }

    return (
        <>
            {!loading && (
                <div>
                    <div className='w-full pl-6 pr-12 flex justify-between'>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => router.back()}>
                            Go Back
                        </button>
                        <Link className='bg-slate-300 hover:bg-slate-500 p-4 rounded-lg'
                            href={{
                                pathname: '/OrderHistory',
                                query: { showroomName: showroomName },
                            }} >
                            <b>Order History</b>
                        </Link>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p className='text-3xl'>Upload Order</p>
                        <div className='flex flex-col sm:flex-row p-8 gap-16 w-full'>

                            <div className='flex flex-col w-full'>
                                <p className='mt-2'>Date : {date}</p>
                                <p className='mt-2'>Order ID : {orderId}</p>
                                <p className='mt-4'>Client Code</p>
                                <div className='flex flex-row gap-2'>
                                    <input type="text" value={clientCode} onChange={(e) => setClientCode(e.target.value)}
                                        className=' p-2 w-full ' />
                                    <button onClick={checkCode} className='p-2 bg-slate-300'>Check</button>
                                </div>
                                <p className='mt-2'>Invoice Number</p>
                                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className=' p-2 w-full ' />

                                <p className=''>Workshop Selection</p>
                                <select className='p-2 w-full' onChange={(e) => setWorkshop(e.target.value)}>
                                    <option value="matasia">Matasia</option>
                                    <option value="mombasa">Mombasa Road</option>
                                </select>

                            </div>
                            <div className='flex flex-col w-full'>
                                <p className=''>Location</p>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                                    className=' p-2 w-full' />

                                <p className='mt-2'>Order Designation</p>
                                <select className='p-2 w-full' onChange={(e) => setOrderDesignation(e.target.value)}>
                                    <option value="showroom">Showroom</option>
                                    <option value="retail">Retail</option>
                                </select>

                                <p className='mt-2'>Order Type</p>
                                <select className='p-2 w-full' onChange={(e) => setOrderType(e.target.value)}>
                                    <option value="standard">Standard</option>
                                    <option value="non-standard">Non-Standard</option>
                                </select>

                                <p className='mt-2'>Client Name</p>
                                <div className='flex flex-row gap-2'>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                        className='p-2 w-full' />
                                    <button onClick={checkName} className='p-2 bg-slate-300'>Check</button>
                                </div>

                            </div>
                        </div>
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

                </div>
            )}
        </>
    )
}
