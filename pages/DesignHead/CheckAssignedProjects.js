import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { db } from '@/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function AssignProjects() {

    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const DesignerId = searchParams.get('id');
    const [designers, setDesigners] = useState([
        { name: "Design Head", id: "0" },
        { name: "Designer 1", id: "1" },
        { name: "Designer 2", id: "2" },
        { name: "Designer 3", id: "3" },
    ])
    const DesignerName = designers[DesignerId].name;
    const dbNamePending = "designer" + DesignerId;
    const dbNameOngoing = dbNamePending + "-ongoing";
    const dbNamePendingAdmin = dbNamePending + "-pending-admin";
    const dbNamePendingClient = dbNamePending + "-pending-client";

    const [pendingDesigns, setPendingDesigns] = useState([])
    const [ongoingDesigns, setOngoingDesigns] = useState([])
    const [pendingAdminDesigns, setPendingAdminDesigns] = useState([])
    const [pendingClientDesigns, setPendingClientDesigns] = useState([])

    useEffect(() => {
        const querySnapshot = onSnapshot(collection(db, dbNamePending), (snapshot) => {
            const pendingDesigns = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingDesigns(pendingDesigns);
        })
        const querySnapshotOngoing = onSnapshot(collection(db, dbNameOngoing), (snapshot) => {
            const ongoingDesigns = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOngoingDesigns(ongoingDesigns);
        })
        const querySnapshotPendingAdmin = onSnapshot(collection(db, dbNamePendingAdmin), (snapshot) => {
            const pendingAdminDesigns = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingAdminDesigns(pendingAdminDesigns);
        })
        const querySnapshotPendingClient = onSnapshot(collection(db, dbNamePendingClient), (snapshot) => {
            const pendingClientDesigns = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingClientDesigns(pendingClientDesigns);
        })
        setLoading(false);
    }, [])


    return (<>
        {!loading && <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col'>
                <p className='text-2xl mx-auto font-bold'>{DesignerName} : Assigned Designs</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                <p className='text-xl mx-auto font-bold'>Pending Designs</p>
                {pendingDesigns.map((designReq) => (
                    <div key={pendingDesigns.id} className='grid grid-cols-4 gap-12 items-center'>
                        <p>{designReq.name} - {designReq.id}</p>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckProgress',
                                query: {
                                    id: designReq.id,
                                    name: designReq.name,
                                    downloadURL: designReq.downloadURL,
                                    status: "pending",
                                    notesOld: designReq.notes,
                                    dbName: dbNamePending,
                                },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Progress
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckSchedule',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Schedule
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckQuote',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Quote
                        </Link>
                    </div>
                ))}
                <p className='mt-4 text-xl mx-auto font-bold'>Ongoing Designs</p>
                {ongoingDesigns.map((designReq) => (
                    <div key={ongoingDesigns.id} className='grid grid-cols-4 gap-12 items-center'>
                        <p>{designReq.name} - {designReq.id}</p>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckProgress',
                                query: {
                                    id: designReq.id,
                                    name: designReq.name,
                                    downloadURL: designReq.downloadURL,
                                    status: "ongoing",
                                    dbName: dbNameOngoing,
                                    notesOld: designReq.notes,
                                },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Progress
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckSchedule',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Schedule
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckQuote',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Quote
                        </Link>
                    </div>
                ))}
                <p className=' mt-4 text-xl mx-auto font-bold'>Pending Admin Approval Designs</p>
                {pendingAdminDesigns.map((designReq) => (
                    <div key={pendingAdminDesigns.id} className='grid grid-cols-4 gap-12 items-center'>
                        <p>{designReq.name} - {designReq.id}</p>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckProgress',
                                query: {
                                    id: designReq.id,
                                    name: designReq.name,
                                    downloadURL: designReq.downloadURL,
                                    status: "pending admin approval",
                                    notesOld: designReq.notes,
                                    dbName: dbNamePendingAdmin,
                                },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Progress
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckSchedule',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Schedule
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckQuote',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Quote
                        </Link>
                    </div>
                ))}
                <p className='mt-4 text-xl mx-auto font-bold'>Pending Client Approval Designs</p>
                {pendingClientDesigns.map((designReq) => (
                    <div key={pendingClientDesigns.id} className='grid grid-cols-4 gap-12 items-center'>
                        <p>{designReq.name} - {designReq.id}</p>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckProgress',
                                query: {
                                    id: designReq.id,
                                    name: designReq.name,
                                    downloadURL: designReq.downloadURL,
                                    status: "pending client approval",
                                    notesOld: designReq.notes,
                                    dbName: dbNamePendingClient,
                                },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Progress
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckSchedule',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Schedule
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckQuote',
                                query: { id: designReq.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Quote
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        }
    </>
    )
}
