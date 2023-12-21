import React, { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'


function SalesInvoice() {

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const [loading, setLoading] = useState(true)
    const [dummyRequests, setDummyRequests] = useState([{
        name: 'Patrick',
        clientCode: '16',
    },
    {
        name: 'Suzie',
        clientCode: '14',
    },
    ])
    const [clientRequests, setClientRequests] = useState([])
    const [originalClientRequests, setOriginalClientRequests] = useState([])
    const [invoiceRequests, setInvoiceRequest] = useState([])

    const [uploadStatus, setUploadStatus] = useState({});

    const router = useRouter()

    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clients'), (snapshot) => {
            var requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            requests = requests.filter((clientRequest) => clientRequest.showroom === showroomName)
            requests = requests.filter((clientRequest) => clientRequest.option === 'retail')
            requests.forEach((clientRequest) => {
                clientRequest.aspects = clientRequest.aspects.join(',')
                clientRequest.date = clientRequest.date
            })
            setClientRequests(requests)
            setOriginalClientRequests(requests)
            setLoading(false)
        })

        return fetch
    }, [])

    // Event handler for file input changes
    const handleFileUpload = (clientId, event) => {
        const file = event.target.files[0];
        // Perform the file upload logic, e.g., using Firebase Storage
        // Once the upload is successful, update the upload status
        setUploadStatus((prevStatus) => ({
            ...prevStatus,
            [clientId]: true,
        }));
    };

    // Event handler for confirming the upload
    const handleConfirm = (clientId) => {
        // Perform the confirmation logic, e.g., update a confirmation status in the database
        // You can also add additional logic here
        clientRequests.forEach((clientRequest) => {
            if (clientRequest.id === clientId) {
                setInvoiceRequest((prevInvoiceRequest) => [...prevInvoiceRequest, clientRequest])
            }
        })
        alert(`Invoice for client ${clientId} confirmed!`);
    };

    return (
        <div>
            {!loading && (
                <div>
                    <div className='w-full pl-8'>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => router.back()}>
                            Go Back
                        </button>
                    </div>
                    <p className='mt-2 text-2xl text-center font-bold mb-4'>
                        INVOICE
                    </p>
                    <p className='mt-8 text-xl mb-4 text-center font-bold'>Upload Invoice</p>
                    {clientRequests.map((clientRequest) => (
                        <div key={clientRequest.id} className='items-center sm:mx-24 grid grid-cols-3 gap-x-12 mb-4'>
                            <p className='text-lg'>{clientRequest.name} (<span>{clientRequest.clientId}</span>)</p>
                            <input type='file' onChange={(e) => handleFileUpload(clientRequest.id, e)} />
                            <button
                                className={`${uploadStatus[clientRequest.id] ? `bg-green-400` : `bg-red-400`}  p-2`}
                                onClick={() => handleConfirm(clientRequest.id)}
                                disabled={!uploadStatus[clientRequest.id]}
                            >
                                Confirm
                            </button>
                        </div>
                    ))
                    }

                    <p className='mt-16 text-xl mb-4 text-center font-bold'>Check Uploaded Invoices</p>
                    {invoiceRequests.map((invoiceRequest) => (
                        <div key={invoiceRequest} className='items-center sm:mx-24 grid grid-cols-3 gap-x-12 mb-4'>
                            <p className='text-lg'>{invoiceRequest.name} ({invoiceRequest.clientId})</p>
                            <button className='bg-green-400 hover:bg-green-500 p-2'>Check Invoice</button>
                            <button className='bg-green-400 hover:bg-green-500 p-2'>Check Information</button>
                        </div>
                    ))
                    }

                </div>
            )}
        </div>
    )
}

export default SalesInvoice