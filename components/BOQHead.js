import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link';

export default function BOQHead() {

    const router = useRouter();

    const BOQPages = [
        // { name: "Measurement Requests from clients", param: "boq" },
        { name: "Pending Measurements", param: "pending-measurements" },
        { name: "Pending Site Quotes", param: "pending-site-quotes" },
        { name: "Pending Showroom design/quote requests", param: "pending-showroom-quotes" },
        { name: "Pending Approval from Admin", param: "pending-admin-approval" },
        { name: "Pending Approval from Client", param: "pending-client-approval" },
        { name: "Rejected Quotes", param: "rejected-quotes" },
    ]

    const [QSMembers, setQSMembers] = useState([
        { name: "QS 1", id: "1" },
        { name: "QS 2", id: "2" },
        { name: "QS 3", id: "3" },
    ])

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

    const { currentUser } = useAuth();

    if (!currentUser || (currentUser.email !== 'admin@stonearts.com' &&
        currentUser.email !== 'boqhead@stonearts.com')) {
        return <div>
            <div className='w-full mb-8 flex justify-start items-start'>
                <button className='bg-slate-300 p-2 rounded-lg' onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            Only BOQ Head can access this page.
        </div>;
    }


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
            <div className='flex flex-col mt-4'>
                <p className='text-2xl mx-auto font-bold'>
                    {currentUser.email === 'boqhead@stonearts.com' ? 'BOQ Head Dashboard' : 'Admin BOQ Dashboard'}
                </p>
            </div>



            <div className='flex flex-col gap-4 mt-8 items-center' >
                <Link
                    href={{
                        pathname: '/BOQHead/MeasurementRequestsDisplay',
                    }}
                    className='bg-slate-300 p-2 rounded-lg text-center sm:w-1/3'>
                    {"Measurement Requests from clients"}
                </Link>
                {BOQPages.map((page) => (
                    <Link
                        key={page["param"]}
                        href={{
                            pathname: '/BOQHead/RequestsDisplay',
                            query: { param: page["param"] },
                        }}
                        className='bg-slate-300 p-2 rounded-lg text-center sm:w-1/3'>
                        {page["name"]}
                    </Link>
                ))}
            </div>
            <div className='flex flex-col'>
                <p className='text-xl mx-auto font-bold my-8'>BOQ Members</p>
                <div className='flex flex-col gap-4 items-center'>
                    {QSMembers.map((member) => (
                        <div key={member["id"]} className='grid grid-cols-3 gap-4 items-center'>
                            <p>{member["name"]}</p>
                            <Link
                                href={{
                                    pathname: 'BOQHead/CheckAssignedProjects',
                                    query: { id: member["id"] },
                                }}
                                className='bg-slate-300 p-2 rounded-lg text-center'>
                                Check Assigned Projects
                            </Link>
                            <Link
                                href={{
                                    pathname: '/BOQHead/AssignProjects',
                                    query: { id: member["id"] },
                                }}
                                className='bg-slate-300 p-2 rounded-lg text-center'>
                                Assign a Project
                            </Link>
                            {/* <Link
                                href={{
                                    pathname: '/BOQHead/CompletedProjects',
                                    query: { id: designer["id"] },
                                }}
                                className='bg-slate-300 p-2 rounded-lg text-center'>
                                Completed Projects
                            </Link> */}
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}
