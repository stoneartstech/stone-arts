import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function DesignHead() {

    const router = useRouter();
    const [designReqsShowroom, setDesignReqsShowroom] = useState([{ name: "sample des", id: "0" }, { name: "sample des2", id: "1" },])
    const [pendingDesigns, setPendingDesigns] = useState([{ name: "sample des", id: "0" }, { name: "sample des2", id: "1" },])
    const [ongoingDesigns, setOngoingDesigns] = useState([{ name: "sample des", id: "0" }, { name: "sample des2", id: "1" },])
    const [pendingAdminDesigns, setPendingAdminDesigns] = useState([{ name: "sample des", id: "0" }, { name: "sample des2", id: "1" },])
    const [pendingClientDesigns, setPendingClientDesigns] = useState([{ name: "sample des", id: "0" }, { name: "sample des2", id: "1" },])
    const [completedDesigns, setCompletedDesigns] = useState([{ name: "sample des", id: "0" }, { name: "sample des2", id: "1" },])

    const [designers, setDesigners] = useState([
        { name: "Designer 1", id: "1" },
        { name: "Designer 2", id: "2" },
        { name: "Designer 3", id: "3" },
    ])

    return (
        <div>
            <div className='w-full pl-8'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col'>
                <p className='text-2xl mx-auto font-bold'>Design Team Head Dashboard</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                <div className='flex flex-col items-center' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <p className='text-xl'>Design Requests from Showrooms</p>
                    {designReqsShowroom.map((designReq) => (
                        <p key={designReq["id"]}>{designReq["name"]}</p>
                    ))}
                </div>
                <div className='flex flex-col items-center' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <p className='text-xl'>Pending Designs to start</p>
                    {pendingDesigns.map((designReq) => (
                        <p key={designReq["id"]}>{designReq["name"]}</p>
                    ))}
                </div>
                <div className='flex flex-col items-center' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <p className='text-xl'>Ongoing Designs</p>
                    {ongoingDesigns.map((designReq) => (
                        <p key={designReq["id"]}>{designReq["name"]}</p>
                    ))}
                </div>
                <div className='flex flex-col items-center' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <p className='text-xl'>Pending Approval from Admin</p>
                    {pendingAdminDesigns.map((designReq) => (
                        <p key={designReq["id"]}>{designReq["name"]}</p>
                    ))}</div>
                <div className='flex flex-col items-center' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <p className='text-xl'>Pending Approval from Client </p>
                    {pendingClientDesigns.map((designReq) => (
                        <p key={designReq["id"]}>{designReq["name"]}</p>
                    ))}</div>
                <div className='flex flex-col items-center' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <p className='text-xl'>Completed Designs</p>
                    {completedDesigns.map((designReq) => (
                        <p key={designReq["id"]}>{designReq["name"]}</p>
                    ))}</div>
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
