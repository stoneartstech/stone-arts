import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { db } from '@/firebase';
import { collection, onSnapshot, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function CompletedProjects() {

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
    const dbName = "designer" + DesignerId + "-completed-designs";

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

    return (<>
        {!loading && <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col'>
                <p className='text-2xl mx-auto font-bold'>{DesignerName} : Completed Designs</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {pendingDesigns.map((designReq) => (
                    <div key={pendingDesigns.id} className='grid grid-cols-4 gap-12 items-center'>
                        <p>{designReq.name}</p>
                        {/* <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => handleProgressCheck(designReq.id)}>
                            Check Progress
                        </button>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => handleScheduleCheck(designReq.id)}>
                            Check Schedule
                        </button>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => handleQuoteCheck(designReq.id)}>
                            Check Quote
                        </button> */}
                    </div>
                ))}
            </div>
        </div>
        }
    </>
    )
}
