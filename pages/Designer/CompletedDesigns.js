import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../firebase'
import { collection, onSnapshot, doc, setDocs, setDoc, docRef, deleteDoc } from 'firebase/firestore';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';


export default function CompletedDesigns() {

    const router = useRouter()

    const [designs, setDesigns] = useState([
        { name: "Design A", id: "1", infoChecked: false },
        { name: "Design B", id: "2", infoChecked: false },
        { name: "Design C", id: "3", infoChecked: false },
    ]);

    const params = useSearchParams();
    const dbName = params.get('param');

    useEffect(() => {
        const designsRef = collection(db, dbName);
        const designsSnapshot = onSnapshot(designsRef, (snapshot) => {
            const designsList = snapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id })
            );
            designsList.forEach(design => design.infoChecked = false);
            setDesigns(designsList);
        });
    }, []);

    const handleCheckInfo = (designId) => {
        const updatedDesigns = designs.map(design => {
            if (design.id === designId) {
                return { ...design, infoChecked: true };
            }
            return design;
        });
        setDesigns(updatedDesigns);
    };


    const handleCheckDesign = async (designId) => {
        const designData = designs.find(design => design.id === designId);
        window.open(designData.downloadURL)
    }

    return (
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-12 my-4'>
                <p className='my-4 text-3xl text-center'>Completed Designs</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {designs.map((design) => (
                    <div key={design["id"]} className='grid grid-cols-4 gap-4 items-center'>
                        <p
                            className=' text-center'>
                            {design["name"]} - {design["id"]} :
                        </p>
                        <button
                            onClick={() => handleCheckDesign(design.id)} // Attach onClick event here
                            className='bg-green-400 p-2 rounded-lg text-center'>
                            Check Design
                        </button>

                        <Link
                            href={{
                                pathname: '/RequestDetails',
                                query: { id: design["id"] },
                            }}
                            className='bg-green-400 p-2 rounded-lg text-center'
                            target='_blank'>
                            <button
                                onClick={() => handleCheckInfo(design.id)} // Attach onClick event here
                            >
                                Check Info
                            </button>
                        </Link>
                    </div>

                ))}
            </div>
        </div>
    )
}
