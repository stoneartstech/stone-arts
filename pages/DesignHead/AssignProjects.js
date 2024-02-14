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

    const [assigned, setAssigned] = useState([]);

    const [pendingDesigns, setPendingDesigns] = useState([])
    useEffect(() => {
        const querySnapshot = onSnapshot(collection(db, "pending-designs"), (snapshot) => {
            const pendingDesigns = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingDesigns(pendingDesigns);
        })
        setLoading(false);
    }, [])

    async function handleAssign(designId) {
        setAssigned([...assigned, designId]);
    };

    async function submitHandler() {
        if (assigned.length === 0) return;
        for (const designId of assigned) {
            const docRef = doc(db, "pending-designs", designId.toString());
            const designDoc = await getDoc(docRef);
            const designData = designDoc.data();
            deleteDoc(docRef);
            const dbName = "designer" + DesignerId;
            await setDoc(doc(db, dbName, designId.toString()), designData);
        }
        alert("Projects assigned successfully");
        router.back();
    }

    const handleUndo = (designId) => {
        const updatedAssigned = assigned.filter((id) => id !== designId);
        setAssigned(updatedAssigned);
    };

    const isAssigned = (designId) => assigned.includes(designId);

    return (<>{!loading && <div>
        <div className='w-full pl-8'>
            <button className='bg-slate-300 p-2 rounded-lg'
                onClick={() => router.back()}>
                Go Back
            </button>
        </div>
        <div className='flex flex-col'>
            <p className='text-2xl mx-auto font-bold'>Assigning sites to {DesignerName}</p>
        </div>
        <div className='flex flex-col gap-4 mt-8 items-center' >
            {pendingDesigns.map((designReq) => (
                <div key={designReq.id} className='grid grid-cols-3 gap-12 items-center'>
                    <p>{designReq.name} - {designReq.id}</p>
                    <button className='bg-green-400 p-2 w-32 rounded-lg text-center disabled:opacity-50'
                        onClick={() => handleAssign(designReq.id)}
                        disabled={isAssigned(designReq.id)}
                    >
                        Assign
                    </button>
                    {isAssigned(designReq.id) && (
                        <button
                            className='bg-red-400 p-2 w-32 rounded-lg text-center'
                            onClick={() => handleUndo(designReq.id)}>
                            Undo
                        </button>
                    )}
                </div>
            ))}
        </div>
        <div className='flex mt-8'>
            <button className='bg-green-400 p-2 rounded-lg text-center text-xl mx-auto'
                onClick={() => submitHandler()}>
                SUBMIT
            </button>
        </div>
    </div>
    }
    </>
    )
}
