import React, { useState, useEffect } from 'react'
import { db, storage } from '../firebase';
import { updateDoc, collection, onSnapshot, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'


function SalesInvoice() {

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const [downloadURLs, setDownloadURLs] = useState({})

    const invoiceDbNames = {
        "Galleria": "invoices",
        "Mirage": "mirage-invoices",
        "Kisumu": "kisumu-invoices",
        "Mombasa Road": "mombasa-invoices",
    }
    const invoiceDbName = invoiceDbNames[showroomName]

    const showroomDbNames = {
        "Galleria": "clients",
        "Mirage": "mirage-clients",
        "Kisumu": "kisumu-clients",
        "Mombasa Road": "mombasa-clients",
    }
    const showroomDbName = showroomDbNames[showroomName]
    console.log(showroomDbName)

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
        const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
            var requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            requests = requests.filter((clientRequest) => clientRequest.option === 'retail')
            requests.forEach((clientRequest) => {
                clientRequest.aspects = clientRequest.aspects.join(',')
                clientRequest.date = clientRequest.date
            })
            setOriginalClientRequests(requests)
            requests = requests.filter((clientRequest) => !clientRequest.invoice)
            setClientRequests(requests)
        })

        const fetch2 = onSnapshot(collection(db, invoiceDbName), (snapshot) => {
            var requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setInvoiceRequest(requests)
            setLoading(false)
        })
        return fetch
    }, [])

    // Event handler for file input changes
    const handleFileUpload = async (clientId, event) => {
        const file = event.target.files[0];
        try {
            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `invoices/${clientId}`)
            await uploadBytes(storageRef, file);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(storageRef);
            setDownloadURLs((prevDownloadURLs) => ({
                ...prevDownloadURLs,
                [clientId]: downloadURL,
            }));
            setUploadStatus((prevStatus) => ({
                ...prevStatus,
                [clientId]: true,
            }));

        } catch (error) {
            console.log(error);
            alert(`File for client could not be uploaded.`);
        }
    };

    // Event handler for confirming the upload
    const handleConfirm = async (clientId) => {
        try {
            const clientRequest = clientRequests.find((request) => request.id === clientId);
            const invoiceData = {
                id: clientRequest.clientId,
                clientId: clientRequest.clientId,
                name: clientRequest.name,
                invoiceURL: downloadURLs[clientId],
                timestamp: serverTimestamp(), // Add a server timestamp for ordering
                // Add other relevant data as needed
            };
            await addDoc(collection(db, invoiceDbName), invoiceData);

            //edit client request
            const docRef = doc(db, showroomDbName, clientId);
            await updateDoc(docRef, {
                "invoice": true,
            });

            setInvoiceRequest((prevInvoiceRequest) => [
                ...prevInvoiceRequest,
                clientRequest,
            ]);
        }
        catch (error) {
            console.log(error);
            alert(`File for client could not be uploaded.`);
        }
    };

    const handleOpenInvoice = (clientId) => {
        const invoiceRequest = invoiceRequests.find((request) => request.clientId == clientId);
        window.open(invoiceRequest.invoiceURL)
    }

    const handleCheckInfo = (clientId) => {
        console.log(clientId)
        const clientRequest = originalClientRequests.find((request) => request.clientId === clientId);
        console.log(originalClientRequests)
        console.log(clientRequest)
        alert(`First Name: ${clientRequest.name}
        \nLast Name: ${clientRequest.lastname}
        \nClient Code: ${clientRequest.clientId}
        \nPhone Number: ${clientRequest.phoneNumber}
        \nEmail: ${clientRequest.email}
        \nAddress: ${clientRequest.address}
        \nDate of Request: ${clientRequest.date}
        \nSalesperson: ${clientRequest.salesPerson}
        \nAspects: ${clientRequest.aspects}
        \nOption: ${clientRequest.option}`)

    }

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
                            <button onClick={() => handleOpenInvoice(invoiceRequest.clientId)} className='bg-green-400 hover:bg-green-500 p-2'>Check Invoice</button>
                            <button onClick={() => handleCheckInfo(invoiceRequest.clientId)} className='bg-green-400 hover:bg-green-500 p-2'>Check Information</button>
                        </div>
                    ))
                    }

                </div>
            )}
        </div>
    )
}

export default SalesInvoice