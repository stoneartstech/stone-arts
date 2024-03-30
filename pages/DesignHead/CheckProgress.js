import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { db } from '@/firebase';
import { collection, onSnapshot, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function CheckProgress() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const designId = searchParams.get('id');
    const designName = searchParams.get('name');
    const status = searchParams.get('status');
    const downloadURL = searchParams.get('downloadURL');


    return (
        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col'>
                <p className='text-2xl mx-auto font-bold'>Progress of Design {designId}</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                <p>Design Name : {designName}</p>
                {downloadURL && <button
                    onClick={() => window.open(downloadURL)}
                    className="bg-green-400 p-2 rounded-lg text-center"
                >
                    Check Design
                </button>}
            </div>
        </div>
    )
}
