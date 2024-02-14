import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase'
import { collection, onSnapshot, doc, setDocs, setDoc, docRef, deleteDoc } from 'firebase/firestore';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';

export default function DesignReqsShowroom() {

    const router = useRouter()

    const [designs, setDesigns] = useState([
        { name: "Design A", id: "1", infoChecked: false, },
    ]);

    const params = useSearchParams();
    const dbName = params.get('param');


    return (
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-12 my-4'>
                <p className='my-4 text-3xl text-center'>Design Requests from Showroom</p>
            </div>
        </div>
    )
}