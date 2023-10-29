import React from 'react'

function AdminDashboard() {
    const options = [
        { title: "Sales", link: '/saleshome' },
        { title: "Design", link: '/designhome' },
        { title: "BOQ", link: '/boqhome' },
        { title: "PMT", link: '/pmthome' },
        { title: "Workshop", link: '/workshophome' },
        { title: "Logistics", link: '/logisticshome' },
        { title: "Drivers", link: '/drivershome' }
    ]


    return (
        <div>
            <p className='text-2xl text-center mb-8'>Admin Home Page</p>
            <div className='flex flex-col text-xl gap-4 items-center'>
                {options.map((option) => (
                    <a key={option.link} href={option.link}
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>
                        {option.title}
                    </a>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard