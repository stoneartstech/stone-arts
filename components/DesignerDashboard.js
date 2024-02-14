import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDocs, setDoc, docRef } from 'firebase/firestore';
import Link from 'next/link'

function DesignerDashboard({ designerId }) {

    const router = useRouter()
    const { logout } = useAuth()
    async function logoutHandler() {
        try {
            await logout()
            router.push('/')
        }
        catch (err) {
            console.log(err)
        }
    }

    const designPages = [
        { name: "Design Requests from Showrooms", path: "Designer/DesignReqsShowroom", param: "design-requests" },
        { name: "Pending Designs to start", path: "Designer/PendingDesigns", param: "pending-designs" },
        { name: "Ongoing Designs", path: "Designer/OngoingDesigns", param: "ongoing-designs" },
        { name: "Pending Approval from Admin", path: "Designer/PendingAdminDesigns", param: "pending-admin-approval" },
        { name: "Pending Approval from Client", path: "Designer/PendingClientDesigns", param: "pending-client-approval" },
        { name: "Completed Designs", path: "Designer/CompletedDesigns", param: "completed-designs" },
    ]

    return (
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
                <button className='bg-red-500 p-2 rounded-lg'
                    onClick={logoutHandler}
                >Logout</button>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-12 my-4'>
                <p className='my-4 text-3xl text-center'>Designer {designerId} Dashboard</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {designPages.map((page) => (
                    <Link
                        key={page["param"]}
                        href={{
                            pathname: page["path"],
                            query: { param: `designer${designerId}-${page["param"]}` },
                        }}
                        className='bg-slate-300 p-2 rounded-lg text-center sm:w-1/3'>
                        {page["name"]}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default DesignerDashboard