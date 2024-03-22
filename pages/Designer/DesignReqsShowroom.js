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
    const [originalDesigns, setOriginalDesigns] = useState([]);

    const params = useSearchParams();
    const dbName = params.get('param');

    const [search, setSearch] = useState('')
    const handleSearch = () => {
        //name or id
        setDesigns(originalDesigns.filter((design) => {
            var searchParam = search.toLowerCase()
            return (
                design.name.toLowerCase().includes(searchParam) ||
                design.id.toString().includes(searchParam)
            )
        })
        )
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
                <p className='my-4 text-3xl text-center'>Design Requests from Showroom</p>
            </div>
            <div className='flex flex-col gap-4 my-4 '>
                <div className='mx-auto'>
                    <input
                        onChange={(e) => setSearch(e.target.value)}
                        className='mx-auto border-2 border-black p-2'
                    />
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2'
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    <div className='bg-slate-300'>
                        {search && originalDesigns
                            .filter((design) => {
                                var searchParam = search.toLowerCase()
                                return (
                                    design.name.toLowerCase().includes(searchParam) ||
                                    design.id.toString().includes(searchParam)
                                )
                            })
                            .slice(0, 10)
                            .map((design) => (
                                <p
                                    key={design.id}
                                    onClick={() => {
                                        setSearch(design.name);
                                        handleSearch();
                                    }}
                                    className='p-2 text-black cursor-pointer'
                                >
                                    {design.id} : {design.name}
                                </p>
                            ))}
                    </div>

                </div>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {designs.map((design) => (
                    <Link
                        key={design.id}
                        target="_blank"
                        href={{
                            pathname: 'RequestDetails',
                            query: { id: design.id, name: design.name, description: design.description }
                        }}
                        className='bg-slate-300 p-2 rounded-lg text-center sm:w-1/3'>
                        {design.name + " -> " + design.id}
                    </Link>
                ))}
            </div>
        </div>
    )
}