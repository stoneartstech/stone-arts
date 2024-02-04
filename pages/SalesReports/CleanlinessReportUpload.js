import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { db, storage } from '../../firebase';
import { updateDoc, collection, onSnapshot, setDoc, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Webcam from 'react-webcam';


export default function CleanlinessReportUpload() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    // const reportType = searchParams.get('reportParam')
    const [loading, setLoading] = useState(false)
    const showroomDbNames = {
        "Galleria": "galleria-cleanliness-report",
        "Mirage": "mirage-cleanliness-report",
        "Kisumu": "kisumu-cleanliness-report",
        "Mombasa Road": "mombasa-cleanliness-report"

    }
    const showroomDbName = showroomDbNames[showroomName]

    const router = useRouter()

    const today = new Date()
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

    const [report, setReport] = useState([
        {
            Date: date,
            CleanerName: '',
            Clean: '',
            Image: '',
        }])

    const handleAddRow = () => {
        const row = {
            SNo: report.length + 1,
            Date: date,
            CleanerName: '',
            Clean: '',
            Image: '',
        }
        setReport([...report, row])
    }
    const handleRemoveRow = (index) => {
        const list = [...report]
        list.splice(index, 1)
        setReport(list)
    }
    // const [downloadURLs, setDownloadURLs] = useState({})
    const handleFileUpload = async (date, Sno, event) => {
        const file = event.target.files[0];
        try {
            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `cleanlinessreports/${showroomName}/${date}/${Sno}`)
            await uploadBytes(storageRef, file);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(storageRef);
            // setDownloadURLs((prevDownloadURLs) => ({
            //     ...prevDownloadURLs,
            //     [date]: [Sno] = downloadURL,
            // }));
            setReport((prevReport) => {
                const updatedReport = [...prevReport];
                if (updatedReport[Sno - 1]) {
                    updatedReport[Sno - 1].Image = downloadURL;
                }
                return updatedReport;
            });

        } catch (error) {
            console.log(error);
            alert(`File for client could not be uploaded.`);
        }
    };

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const webcamRef = useRef(null);

    const handleToggleCamera = () => {
        setIsCameraOpen(!isCameraOpen);
    };

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // Now you can handle the captured image, maybe upload it or display it
        console.log('Captured Image:', imageSrc);
        setIsCameraOpen(false);
    };

    return (<>{!loading && <div>
        <div className='w-full pl-8'>
            <button className='bg-slate-300 p-2 rounded-lg'
                onClick={() => router.back()}>
                Go Back
            </button>
        </div>
        <p className='mt-2 text-2xl text-center font-bold mb-4'>
            Upload Showroom Cleanliness Report
        </p>
        <div className='max-w-full overflow-auto'>
            <table className='mt-6'>
                <thead className=''>
                    <tr>
                        <th className='px-2'>S. No.</th>
                        <th className='px-2'>Date</th>
                        <th className='px-2'>Cleaner Name</th>
                        <th className='px-2'>Clean(Yes/No)</th>
                        <th className='px-2'>Image</th>
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
                                <input type="text" value={item.CleanerName} onChange={(e) => {
                                    const list = [...report]
                                    list[index].CleanerName = e.target.value
                                    setReport(list)
                                }}
                                    className='px-2 py-2 w-full' />
                            </td>
                            <td>
                                <input type="text" value={item.Clean} onChange={(e) => {
                                    const list = [...report]
                                    list[index].Clean = e.target.value
                                    setReport(list)
                                }}
                                    className='px-2 py-2 w-full' />
                            </td>
                            <td>
                                <td>
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
                                            onChange={(e) => handleFileUpload(item.Date, index + 1, e)}
                                            className='px-4 py-2 w-full'
                                        />
                                    )}
                                </td>
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

    </div>}</>

    )
}
