import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db, storage } from '../../firebase'
import { collection, onSnapshot, doc, setDocs, setDoc, docRef, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';

function RequestsDisplay() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const param = searchParams.get('param')

    const designPages = [
        { name: "Design Requests from Showrooms", param: "design-requests" },
        { name: "Pending Designs to start", param: "pending-designs" },
        { name: "Ongoing Designs", param: "ongoing" },
        { name: "Pending Approval from Admin", param: "pending-admin" },
        { name: "Pending Approval from Client", param: "pending-client" },
        { name: "Completed Designs", param: "completed" },
    ]
    const page = designPages.find(page => page.param === param)

    const [loading, setLoading] = useState(true)

    const [designers, setDesigners] = useState([
        { name: "Design Head", id: "0" },
        { name: "Designer 1", id: "1" },
        { name: "Designer 2", id: "2" },
        { name: "Designer 3", id: "3" },
    ])
    const [designs, setDesigns] = useState([])
    const [originalDesigns, setOriginalDesigns] = useState([])
    useEffect(() => {
        setLoading(true); // Set loading to true initially

        // Create an array to store promises
        const promises = designers.map(async (designer) => {
            const designerId = designer.id;
            const dbName = "designer" + designerId + "-" + param;
            const designsRef = collection(db, dbName);

            // Return a promise that resolves when snapshot is received
            return new Promise((resolve, reject) => {
                const designsSnapshot = onSnapshot(designsRef, (snapshot) => {
                    const designsList = snapshot.docs.map(
                        (doc) => ({ ...doc.data(), id: doc.id })
                    );
                    resolve(designsList); // Resolve the promise with designsList
                });
            });
        });

        // Use Promise.all to wait for all promises to resolve
        Promise.all(promises).then((designsLists) => {
            // Flatten the array of arrays into a single array of designs
            const flattenedDesigns = designsLists.flat();
            // Set the designs state with the flattened array
            setDesigns(flattenedDesigns);
            setOriginalDesigns(flattenedDesigns);
            setLoading(false); // Set loading to false when all promises are resolved
        });
    }, []);

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


    return (<>{!loading &&
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col mt-4'>
                <p className='text-2xl mx-auto font-bold'>{page.name}</p>
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
                        key={design["id"]}
                        href={{
                            pathname: '/RequestDetails',
                            query: { id: design["id"], name: design["name"], description: design["description"] }
                        }}
                        className='bg-slate-300 p-2 rounded-lg text-center sm:w-1/3'>
                        {design["name"] + " -> " + design["id"]}
                    </Link>
                ))}
            </div>

        </div>
    }</>
    )
}

export default RequestsDisplay