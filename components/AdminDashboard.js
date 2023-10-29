import React from 'react'

function AdminDashboard() {
    const options = {
        "Sales": '/saleshome',
        "Design": '/designhome',
        "BOQ": '/boqhome',
        "PMT": '/pmthome',
        "Workshop": '/workshophome',
        "Logistics": '/logisticshome',
        "Drivers": '/drivershome',
    }
    return (
        <div>
            <p className='text-2xl text-center mb-8'>Admin Home Page</p>
            <div className='flex flex-col text-xl gap-4 items-center'>
                {Object.keys(options).map((option) => (
                    <a href={options[option]}
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>
                        {option}
                    </a>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard