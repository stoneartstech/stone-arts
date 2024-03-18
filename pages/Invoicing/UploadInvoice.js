import React, { useState, useEffect, useRef } from 'react'
import { db, storage } from '../../firebase';
import { updateDoc, collection, onSnapshot, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'

import Webcam from 'react-webcam';


export default function UploadInvoice() {

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

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const webcamRef = useRef(null);

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // Now you can handle the captured image, maybe upload it or display it
        console.log('Captured Image:', imageSrc);
        setIsCameraOpen(false);
    };

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
                            <div>
                                {isCameraOpen ? (
                                    <div>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                        />
                                        <button
                                            className='bg-slate-300 p-2 rounded-lg'
                                            onClick={handleCapture}
                                        >
                                            Capture
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(clientRequest.id, e)}
                                    />
                                )}
                            </div>
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


                </div>
            )}
        </div>
    )
}
