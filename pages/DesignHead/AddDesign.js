import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '@/firebase';
import { collection, onSnapshot, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function AddDesign() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [designId, setDesignId] = useState();

    const [clientFirstName, setClientFirstName] = useState('');
    const [clientLastName, setClientLastName] = useState('');
    const [clientPhoneNumber, setClientPhoneNumber] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');

    const handleAddDesign = async () => {
        setLoading(true);
        var designId = await getDoc(doc(db, "designId", "designId"));
        designId = designId.data().id;

        setDesignId(designId);
        const docRef = doc(db, "pending-designs", designId.toString());
        await setDoc(docRef, {
            name: title,
            description: description,
            id: designId,
            clientFirstName: clientFirstName,
            clientLastName: clientLastName,
            clientPhoneNumber: clientPhoneNumber,
            clientEmail: clientEmail,
            clientAddress: clientAddress
        });
        await setDoc(doc(db, "designId", "designId"), { id: designId + 1 });
        setLoading(false);
        alert('Design Added with id: ' + designId);
        router.back();
    };

    return (
        <div>
            {!loading && (
                <div>
                    <div className='w-full pl-8'>
                        <button
                            className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => router.back()}
                        >
                            Go Back
                        </button>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-2xl mx-auto font-bold'>Add Design</p>
                    </div>
                    <div className='flex flex-col gap-4 mt-8 items-center sm:w-1/2 mx-auto'>
                        <p className=''>Title:<span className='text-red-500'>*</span></p>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className=' p-2 w-full '
                        />
                        <p className=''>Description:<span className='text-red-500'>*</span></p>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className=' p-2 w-full '
                        />

                        {/* Client Fields */}
                        <p className=''>Client First Name:<span className='text-red-500'>*</span></p>
                        <input
                            type="text"
                            value={clientFirstName}
                            onChange={(e) => setClientFirstName(e.target.value)}
                            className=' p-2 w-full '
                        />

                        <p className=''>Client Last Name:<span className='text-red-500'>*</span></p>
                        <input
                            type="text"
                            value={clientLastName}
                            onChange={(e) => setClientLastName(e.target.value)}
                            className=' p-2 w-full '
                        />

                        <p className=''>Client Phone Number:<span className='text-red-500'>*</span></p>
                        <PhoneInput 
                            country={'ke'}
                            inputProps={{
                                required: true,
                                className: 'p-2 w-full'
                            }}
                            placeholder='Enter phone number'
                            value={clientPhoneNumber}
                            onChange={(value) => setClientPhoneNumber(value)}
                            className=' w-full'
                        />

                        <p className=''>Client Email ID:<span className='text-red-500'>*</span></p>
                        <input
                            type="text"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className=' p-2 w-full '
                        />

                        <p className=''>Client Address:<span className='text-red-500'>*</span></p>
                        <input
                            type="text"
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            className=' p-2 w-full '
                        />

                        <button
                            className='bg-green-400 p-2 rounded-lg'
                            onClick={handleAddDesign}
                        >
                            Add Design
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
