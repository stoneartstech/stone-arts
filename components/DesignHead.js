import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'

export default function DesignHead() {

    const router = useRouter();

    const [designers, setDesigners] = useState([
        { name: "Design Head", id: "0" },
        { name: "Designer 1", id: "1" },
        { name: "Designer 2", id: "2" },
        { name: "Designer 3", id: "3" },
    ])

    const designPages = [
        { name: "Design Requests from Showrooms", param: "design-requests" },
        { name: "Pending Designs to start", param: "pending-designs" },
        { name: "Ongoing Designs", param: "ongoing" },
        { name: "Pending Approval from Admin", param: "pending-admin" },
        { name: "Pending Approval from Client", param: "pending-client" },
        { name: "Completed Designs", param: "completed" },
    ]

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
        currentUser.email !== 'designhead@stonearts.com')) {
        return <div>
            <div className='w-full mb-8 flex justify-start items-start'>
                <button className='bg-slate-300 p-2 rounded-lg' onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            Only Design Head can access this page.
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
                    {currentUser.email === 'designhead@stonearts.com'
                        ? 'Design Head Dashboard' : 'Admin Design Dashboard'}
                </p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {designPages.map((page) => (
                    <Link
                        key={page["param"]}
                        href={{
                            pathname: '/DesignHead/RequestsDisplay',
                            query: { param: page["param"] },
                        }}
                        className='bg-slate-300 p-2 rounded-lg text-center sm:w-1/3'>
                        {page["name"]}
                    </Link>
                ))}
                <Link
                    href={{
                        pathname: 'DesignHead/AddDesign',
                    }}
                    className='bg-slate-300 p-2 rounded-lg text-center font-bold my-4 w-52 mx-auto'>
                    Add Design
                </Link>
            </div>

            <div className='flex flex-col'>
                <p className='text-xl mx-auto font-bold my-8'>Design Team Members</p>
                <div className='flex flex-col gap-4 items-center'>
                    {designers.map((designer) => (
                        <div key={designer["id"]} className='grid grid-cols-4 gap-4 items-center'>
                            <p>{designer["name"]}</p>
                            <Link
                                href={{
                                    pathname: 'DesignHead/CheckAssignedProjects',
                                    query: { id: designer["id"] },
                                }}
                                className='bg-slate-300 p-2 rounded-lg text-center'>
                                Check Assigned Projects
                            </Link>
                            <Link
                                href={{
                                    pathname: '/DesignHead/AssignProjects',
                                    query: { id: designer["id"] },
                                }}
                                className='bg-slate-300 p-2 rounded-lg text-center'>
                                Assign a Project
                            </Link>
                            <Link
                                href={{
                                    pathname: '/DesignHead/CompletedProjects',
                                    query: { id: designer["id"] },
                                }}
                                className='bg-slate-300 p-2 rounded-lg text-center'>
                                Completed Projects
                            </Link>
                        </div>
                    ))}
                </div>

            </div>


        </div>
    )
}
