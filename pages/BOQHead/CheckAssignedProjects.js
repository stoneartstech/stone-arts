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
    const QSId = searchParams.get('id');
    const [QSMembers, setQSMembers] = useState([
        { name: "QS 1", id: "1" },
        { name: "QS 2", id: "2" },
        { name: "QS 3", id: "3" },
    ])
    const QSName = QSMembers[QSId - 1].name;
    const dbName = "qs" + QSId;

    const [pendingProjects, setPendingProjects] = useState([])
    useEffect(() => {
        const querySnapshot = onSnapshot(collection(db, dbName), (snapshot) => {
            const pendingProjects = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingProjects(pendingProjects);
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
                <p className='text-2xl mx-auto font-bold'>{QSName} : Pending Projects</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {pendingProjects.map((project) => (
                    <div key={pendingProjects.id} className='grid grid-cols-4 gap-12 items-center'>
                        <p>{project.name} - {project.id}</p>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => handleProgressCheck(project.id)}>
                            Check Progress
                        </button>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckSchedule',
                                query: { id: project.id },
                            }}
                            className='bg-slate-300 p-2 rounded-lg text-center'>
                            Check Schedule
                        </Link>
                        <Link
                            href={{
                                pathname: '/DesignHead/CheckQuote',
                                query: { id: project.id },
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
