import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { db } from '@/firebase';
import { collection, onSnapshot, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function AssignProjects() {

    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const DesignerId = searchParams.get('id');
    const [designers, setDesigners] = useState([
        { name: "Designer 1", id: "1" },
        { name: "Designer 2", id: "2" },
        { name: "Designer 3", id: "3" },
    ])
    const DesignerName = designers[DesignerId - 1].name;
    const dbName = "designer" + DesignerId;

    const [pendingDesigns, setPendingDesigns] = useState([])
    useEffect(() => {
        const querySnapshot = onSnapshot(collection(db, dbName), (snapshot) => {
            const pendingDesigns = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingDesigns(pendingDesigns);
        })
        setLoading(false);
    }, [])

    const handleProgressCheck = (id) => {
        const design = pendingDesigns.find((design) => design.id === id);
        alert("Design is in stage - " + design.status)
    }
    const handleScheduleCheck = (id) => {
    }
    const handleQuoteCheck = (id) => {
        const design = pendingDesigns.find((design) => design.id === id);
        const quote = design.quote;
        if (quote) {
            alert("Quote is ready - " + quote)
        }
        else {
            alert("Quote is not given yet")
        }
    }

    return (<>
        {!loading && <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col'>
                <p className='text-2xl mx-auto font-bold'>{DesignerName} : Pending Designs</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {pendingDesigns.map((designReq) => (
                    <div key={pendingDesigns.id} className='grid grid-cols-4 gap-12 items-center'>
                        <p>{designReq.name} - {designReq.id}</p>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => handleProgressCheck(designReq.id)}>
                            Check Progress
                        </button>
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
