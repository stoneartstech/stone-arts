import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VisitorsReportUpload() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    const showroomDbNames = {
        "Galleria": "galleria-visitors-report",
        "Mirage": "mirage-visitors-report",
        "Kisumu": "kisumu-visitors-report",
        "Mombasa Road": "mombasa-visitors-report"
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
            Designer: 'no',
            Owner: 'no',
            Architect: 'no',
            MaterialOfInterest: '',
            SampleCatalogue: '',
            Progress: '',
            Contact: '',
            SiteLocation: '',
            FollowUp: '',
            Chances: '',
        }])

    const handleAddRow = () => {
        const row = {
            SNo: report.length + 1,
            Date: date,
            ClientName: '',
            Designer: 'no',
            Owner: 'no',
            Architect: 'no',
            Material: '',
            SampleCatalogue: '',
            Progress: '',
            Contact: '',
            SiteLocation: '',
            FollowUp: '',
            Reference: '',
            Chances: '',
        }
        setReport([...report, row])
    }
    const handleRemoveRow = (index) => {
        const list = [...report]
        list.splice(index, 1)
        setReport(list)
    }

    const clientShowroomDbNames = {
        "Galleria": "clients",
        "Mirage": "mirage-clients",
        "Kisumu": "kisumu-clients",
        "Mombasa Road": "mombasa-clients",
    }
    const clientShowroomDbName = clientShowroomDbNames[showroomName]
    const [todayClients, setTodayClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = onSnapshot(collection(db, clientShowroomDbName), (snapshot) => {
            var requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            requests.forEach((clientRequest) => {
                clientRequest.aspects = clientRequest.aspects?.join(',')
            })
            setTodayClients(prevClients => {
                const newClients = [...prevClients];
                requests.forEach((clientRequest) => {
                    if (clientRequest.date == date) {
                        newClients.push(clientRequest);
                    }
                });

                return newClients;
            });
        });
        setLoading(false)
        return fetch
    }, [])

    useEffect(() => {
        if (todayClients.length > 0) {
            const newReport = []
            todayClients.forEach((clientRequest, index) => {
                const row = {
                    SNo: index + 1,
                    Date: date,
                    ClientName: clientRequest.name,
                    Designer: 'no',
                    Owner: 'no',
                    Architect: 'no',
                    Material: clientRequest.aspects,
                    SampleCatalogue: '',
                    Progress: '',
                    Contact: clientRequest.number,
                    SiteLocation: clientRequest.address,
                    FollowUp: '',
                    Reference: '',
                    Chances: '',
                }
                newReport.push(row)
            })
            setReport(newReport)
        }
    }, [todayClients]);

    return (<>{!loading &&
        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <p className='mt-2 text-2xl text-center font-bold mb-4'>
                Upload Visitors Report
            </p>
            <div className='max-w-full overflow-auto'>
                <table className='mt-6'>
                    <thead className=''>
                        <tr>
                            <th className='px-2'>S. No.</th>
                            <th className='px-2'>Date</th>
                            <th className='px-2'>Client Name</th>
                            <th className='px-2'>Designer</th>
                            <th className='px-2'>Owner</th>
                            <th className='px-2'>Architect</th>
                            <th className='px-2'>Material Of Interest</th>
                            <th className='px-2'>Sample/Catalogue</th>
                            <th className='px-2'>Progress of Project</th>
                            <th className='px-2'>Contact of Client</th>
                            <th className='px-2'>Site Location</th>
                            <th className='px-2'>Follow Up</th>
                            <th className='px-2'>Reference</th>
                            <th className='px-2'>Chances %</th>
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
                                    <input
                                        type="checkbox"
                                        checked={item.Designer === 'yes'}
                                        onChange={(e) => {
                                            const list = [...report];
                                            list[index].Designer = e.target.checked ? 'yes' : 'no';
                                            setReport(list);
                                        }}
                                        className='p-2 w-full'
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.Owner === 'yes'}
                                        onChange={(e) => {
                                            const list = [...report];
                                            list[index].Owner = e.target.checked ? 'yes' : 'no';
                                            setReport(list);
                                        }}
                                        className='p-2 w-full'
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.Architect === 'yes'}
                                        onChange={(e) => {
                                            const list = [...report];
                                            list[index].Architect = e.target.checked ? 'yes' : 'no';
                                            setReport(list);
                                        }}
                                        className='p-2 w-full'
                                    />
                                </td>

                                <td>
                                    <input type="text" value={item.Material} onChange={(e) => {
                                        const list = [...report]
                                        list[index].Material = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.SampleCatalogue} onChange={(e) => {
                                        const list = [...report]
                                        list[index].SampleCatalogue = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.Progress} onChange={(e) => {
                                        const list = [...report]
                                        list[index].Progress = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.Contact} onChange={(e) => {
                                        const list = [...report]
                                        list[index].Contact = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.SiteLocation} onChange={(e) => {
                                        const list = [...report]
                                        list[index].SiteLocation = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.FollowUp} onChange={(e) => {
                                        const list = [...report]
                                        list[index].FollowUp = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.Reference} onChange={(e) => {
                                        const list = [...report]
                                        list[index].Reference = e.target.value
                                        setReport(list)
                                    }}
                                        className='p-2 w-full' />
                                </td>
                                <td>
                                    <input type="text" value={item.Chances} onChange={(e) => {
                                        const list = [...report]
                                        list[index].Chances = e.target.value
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
    }</>
    )
}
